import { fetcher, ApiError } from "@/shared/fetcher";
import { API_URL } from "@/shared/env";
import { useAuthStore } from "@/auth/auth.store";
import type {
  Expediente,
  ExpedienteListResponse,
  ExpedienteFilters,
  CreateExpedienteDTO,
  UpdateExpedienteDTO,
  UpdateEstadoDTO,
} from "./expedientes.types";

/**
 * Construye los parámetros de query para el backend
 * Mapea page→pagina y pageSize→tamanoPagina
 */
function buildQueryParams(filters?: ExpedienteFilters): Record<string, string> {
  const params: Record<string, string> = {};

  if (!filters) return params;

  // Mapear aliases de paginación
  if (filters.page !== undefined) params.pagina = String(filters.page);
  if (filters.pageSize !== undefined) params.tamanoPagina = String(filters.pageSize);

  // Otros filtros
  if (filters.q) params.q = filters.q;
  if (filters.estado) params.estado = filters.estado;
  if (filters.tecnicoId !== undefined) params.tecnicoId = String(filters.tecnicoId);
  if (filters.fechaInicio) params.fechaInicio = filters.fechaInicio;
  if (filters.fechaFin) params.fechaFin = filters.fechaFin;

  return params;
}

/**
 * Extrae el nombre del archivo desde el header Content-Disposition
 */
function getFilenameFromResponse(response: Response): string | null {
  const disposition = response.headers.get("Content-Disposition");
  if (disposition) {
    const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
      return filenameMatch[1].replace(/['"]/g, "");
    }
  }
  return null;
}

/**
 * Descarga un blob como archivo
 */
function downloadBlob(blob: Blob, filename: string) {
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(downloadUrl);
  document.body.removeChild(a);
}

/**
 * Muestra un toast usando el event bus
 */
function showToast(title: string, description: string, variant: "default" | "destructive" | "success" = "default") {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("show-toast", {
      detail: { title, description, variant },
    });
    window.dispatchEvent(event);
  }
}

export const expedientesApi = {
  /**
   * Lista expedientes con filtros y paginación
   */
  list: (filters?: ExpedienteFilters) =>
    fetcher.get<ExpedienteListResponse>("/expedientes", buildQueryParams(filters)),

  /**
   * Obtiene un expediente por ID
   */
  getById: (id: number) =>
    fetcher.get<Expediente>(`/expedientes/${id}`),

  /**
   * Crea un nuevo expediente
   */
  create: (data: CreateExpedienteDTO) =>
    fetcher.post<Expediente>("/expedientes", data),

  /**
   * Actualiza un expediente existente
   */
  update: (id: number, data: UpdateExpedienteDTO) =>
    fetcher.put<Expediente>(`/expedientes/${id}`, data),

  /**
   * Cambia el estado de un expediente (Aprobar/Rechazar)
   * Si estado es "Rechazado", justificacion es obligatoria
   */
  updateEstado: (id: number, data: UpdateEstadoDTO) => {
    // Validación previa: si es rechazo, debe tener justificación
    if (data.estado === "Rechazado" && !data.justificacion?.trim()) {
      throw new Error("La justificación es obligatoria para rechazar un expediente");
    }
    
    // El backend puede esperar estados en minúsculas
    const payload = {
      estado: data.estado.toLowerCase(), // "Aprobado" → "aprobado"
      justificacion: data.justificacion
    };
    
    console.log("🔄 Actualizando estado del expediente:", id, payload);
    return fetcher.patch<Expediente>(`/expedientes/${id}/estado`, payload);
  },

  /**
   * Exporta múltiples expedientes a Excel con filtros
   * Maneja rate limiting (429) y errores
   */
  exportExcel: async (filters?: ExpedienteFilters) => {
    try {
      const params = new URLSearchParams(buildQueryParams(filters));
      const queryString = params.toString();
      const url = `${API_URL}/expedientes/export${queryString ? `?${queryString}` : ""}`;

      const token = useAuthStore.getState().token;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });

      // Manejar errores HTTP
      if (!response.ok) {
        const rateLimitInfo = {
          limit: response.headers.get("ratelimit-limit"),
          remaining: response.headers.get("ratelimit-remaining"),
          reset: response.headers.get("ratelimit-reset"),
        };

        if (response.status === 429) {
          // Rate limit exceeded
          let message = "Has excedido el límite de exportaciones.";
          
          if (rateLimitInfo.reset) {
            const resetDate = new Date(Number(rateLimitInfo.reset) * 1000);
            const secondsUntilReset = Math.ceil((resetDate.getTime() - Date.now()) / 1000);
            if (secondsUntilReset > 0) {
              message += ` Intenta de nuevo en ${secondsUntilReset} segundos.`;
            }
          }

          const retryAfter = response.headers.get("retry-after");
          if (retryAfter) {
            message += ` Espera ${retryAfter}s antes de reintentar.`;
          }

          throw new ApiError(message, 429, null, {
            limit: Number(rateLimitInfo.limit) || 0,
            remaining: Number(rateLimitInfo.remaining) || 0,
            reset: Number(rateLimitInfo.reset) || 0,
          });
        }

        throw new ApiError("Error al exportar expedientes", response.status);
      }

      // Verificar tipo de contenido
      const contentType = response.headers.get("Content-Type");
      if (!contentType?.includes("spreadsheet") && !contentType?.includes("excel")) {
        throw new Error("El servidor no devolvió un archivo Excel válido");
      }

      const blob = await response.blob();
      
      // Intentar obtener filename del header, sino usar fallback
      const filename = getFilenameFromResponse(response) || 
        `expedientes_${new Date().toISOString().split("T")[0]}.xlsx`;

      downloadBlob(blob, filename);
      
      showToast(
        "✅ Exportación exitosa",
        `Archivo ${filename} descargado correctamente.`,
        "success"
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        showToast(
          "Límite de exportaciones alcanzado",
          error.message,
          "destructive"
        );
      } else {
        showToast(
          "Error al exportar",
          error instanceof Error ? error.message : "No se pudo generar el archivo.",
          "destructive"
        );
      }
      throw error;
    }
  },

  /**
   * Exporta un solo expediente con sus indicios a Excel
   * Maneja rate limiting (429) y errores
   */
  exportSingle: async (expedienteId: number) => {
    try {
      const url = `${API_URL}/expedientes/${expedienteId}/export`;

      const token = useAuthStore.getState().token;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });

      // Manejar errores HTTP
      if (!response.ok) {
        const rateLimitInfo = {
          limit: response.headers.get("ratelimit-limit"),
          remaining: response.headers.get("ratelimit-remaining"),
          reset: response.headers.get("ratelimit-reset"),
        };

        if (response.status === 429) {
          let message = "Has excedido el límite de exportaciones.";
          
          if (rateLimitInfo.reset) {
            const resetDate = new Date(Number(rateLimitInfo.reset) * 1000);
            const secondsUntilReset = Math.ceil((resetDate.getTime() - Date.now()) / 1000);
            if (secondsUntilReset > 0) {
              message += ` Intenta de nuevo en ${secondsUntilReset} segundos.`;
            }
          }

          throw new ApiError(message, 429, null, {
            limit: Number(rateLimitInfo.limit) || 0,
            remaining: Number(rateLimitInfo.remaining) || 0,
            reset: Number(rateLimitInfo.reset) || 0,
          });
        }

        if (response.status === 404) {
          throw new ApiError("Expediente no encontrado", 404);
        }

        throw new ApiError("Error al exportar expediente", response.status);
      }

      // Verificar tipo de contenido
      const contentType = response.headers.get("Content-Type");
      if (!contentType?.includes("spreadsheet") && !contentType?.includes("excel")) {
        throw new Error("El servidor no devolvió un archivo Excel válido");
      }

      const blob = await response.blob();
      
      // Intentar obtener filename del header, sino usar fallback
      const filename = getFilenameFromResponse(response) || 
        `expediente_${expedienteId}_${new Date().toISOString().split("T")[0]}.xlsx`;

      downloadBlob(blob, filename);
      
      showToast(
        "✅ Exportación exitosa",
        `Expediente ${expedienteId} descargado correctamente.`,
        "success"
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        showToast(
          "Límite de exportaciones alcanzado",
          error.message,
          "destructive"
        );
      } else {
        showToast(
          "Error al exportar",
          error instanceof Error ? error.message : "No se pudo generar el archivo.",
          "destructive"
        );
      }
      throw error;
    }
  },
};

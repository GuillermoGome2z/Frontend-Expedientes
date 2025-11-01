import { fetcher } from "@/shared/fetcher";
import type {
  Expediente,
  ExpedienteListResponse,
  ExpedienteFilters,
  CreateExpedienteDTO,
  UpdateExpedienteDTO,
  UpdateEstadoDTO,
} from "./expedientes.types";

export const expedientesApi = {
  list: (filters?: ExpedienteFilters) =>
    fetcher.get<ExpedienteListResponse>("/expedientes", filters),

  getById: (id: number) =>
    fetcher.get<{ data: Expediente }>(`/expedientes/${id}`),

  create: (data: CreateExpedienteDTO) =>
    fetcher.post<{ data: Expediente }>("/expedientes", data),

  update: (id: number, data: UpdateExpedienteDTO) =>
    fetcher.put<{ data: Expediente }>(`/expedientes/${id}`, data),

  updateEstado: (id: number, data: UpdateEstadoDTO) =>
    fetcher.patch<{ data: Expediente }>(`/expedientes/${id}/estado`, data),

  exportExcel: async (filters?: ExpedienteFilters) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/expedientes/export?${new URLSearchParams(filters as any)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("expedientes_auth") ? JSON.parse(localStorage.getItem("expedientes_auth")!).token : ""}`,
        },
      }
    );
    
    if (!response.ok) throw new Error("Error al exportar");
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expedientes_${new Date().toISOString().split("T")[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};

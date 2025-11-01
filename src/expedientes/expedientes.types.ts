/**
 * Estados posibles de un expediente
 * El backend puede enviar en minúsculas o mayúsculas
 */
export type EstadoExpediente = "Abierto" | "Aprobado" | "Rechazado" | "abierto" | "aprobado" | "rechazado";

/**
 * Expediente completo
 */
export interface Expediente {
  id: number;
  codigo: string;
  titulo: string;
  descripcion: string;
  estado: EstadoExpediente | string; // Permitir string para manejar valores inesperados
  tecnicoId: number;
  tecnico?: {
    id: number;
    username: string;
  } | null;
  justificacionEstado?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Respuesta del listado de expedientes con paginación
 */
export interface ExpedienteListResponse {
  page: number;
  pageSize: number;
  total: number;
  data: Expediente[];
}

/**
 * Filtros para el listado de expedientes
 */
export interface ExpedienteFilters {
  page?: number;
  pageSize?: number;
  q?: string;
  estado?: EstadoExpediente;
  tecnicoId?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

/**
 * DTO para crear un expediente
 */
export interface CreateExpedienteDTO {
  codigo: string;
  titulo: string;
  descripcion: string;
}

/**
 * DTO para actualizar un expediente
 */
export interface UpdateExpedienteDTO extends Partial<CreateExpedienteDTO> {}

/**
 * DTO para cambiar el estado de un expediente
 */
export interface UpdateEstadoDTO {
  estado: "Aprobado" | "Rechazado";
  justificacion?: string;
}

export interface Expediente {
  id: number;
  codigo: string;
  titulo: string;
  descripcion: string;
  estado: "Abierto" | "Aprobado" | "Rechazado";
  tecnicoId: number;
  tecnico?: {
    id: number;
    username: string;
  };
  justificacionEstado?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpedienteListResponse {
  pagina: number;
  pageSize: number;
  total: number;
  data: Expediente[];
}

export interface ExpedienteFilters {
  pagina?: number;
  page?: number;
  pageSize?: number;
  q?: string;
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface CreateExpedienteDTO {
  codigo: string;
  titulo: string;
  descripcion: string;
}

export interface UpdateExpedienteDTO extends Partial<CreateExpedienteDTO> {}

export interface UpdateEstadoDTO {
  estado: "Aprobado" | "Rechazado";
  justificacion?: string;
}

export interface Indicio {
  id: number;
  descripcion: string;
  peso?: number;
  color?: string;
  tamano?: string;
  activo: boolean;
  expedienteId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IndicioListResponse {
  pagina: number;
  pageSize: number;
  total: number;
  data: Indicio[];
}

export interface CreateIndicioDTO {
  descripcion: string;
  peso?: number;
  color?: string;
  tamano?: string;
}

export interface UpdateIndicioDTO extends Partial<CreateIndicioDTO> {}

export interface IndicioFilters {
  pagina?: number;
  page?: number;
  pageSize?: number;
}

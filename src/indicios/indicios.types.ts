/**
 * Indicio asociado a un expediente
 */
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

/**
 * Respuesta del listado de indicios con paginación
 */
export interface IndicioListResponse {
  page: number;
  pageSize: number;
  total: number;
  data: Indicio[];
}

/**
 * DTO para crear un indicio
 */
export interface CreateIndicioDTO {
  descripcion: string;
  peso?: number;
  color?: string;
  tamano?: string;
}

/**
 * DTO para actualizar un indicio
 */
export interface UpdateIndicioDTO extends Partial<CreateIndicioDTO> {}

/**
 * Filtros para el listado de indicios
 */
export interface IndicioFilters {
  page?: number;
  pageSize?: number;
}

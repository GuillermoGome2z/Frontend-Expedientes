import { fetcher } from "@/shared/fetcher";
import type {
  Indicio,
  IndicioListResponse,
  IndicioFilters,
  CreateIndicioDTO,
  UpdateIndicioDTO,
} from "./indicios.types";

/**
 * Construye los parámetros de query para el backend
 * Mapea page→pagina y pageSize→tamanoPagina
 */
function buildQueryParams(filters?: IndicioFilters): Record<string, string> {
  const params: Record<string, string> = {};

  if (!filters) return params;

  // Mapear aliases de paginación
  if (filters.page !== undefined) params.pagina = String(filters.page);
  if (filters.pageSize !== undefined) params.tamanoPagina = String(filters.pageSize);

  return params;
}

export const indiciosApi = {
  /**
   * Lista indicios de un expediente con paginación
   */
  list: (expedienteId: number, filters?: IndicioFilters) =>
    fetcher.get<IndicioListResponse>(
      `/expedientes/${expedienteId}/indicios`,
      buildQueryParams(filters)
    ),

  /**
   * Crea un nuevo indicio para un expediente
   */
  create: (expedienteId: number, data: CreateIndicioDTO) =>
    fetcher.post<Indicio>(`/expedientes/${expedienteId}/indicios`, data),

  /**
   * Actualiza un indicio existente
   */
  update: (id: number, data: UpdateIndicioDTO) =>
    fetcher.put<Indicio>(`/indicios/${id}`, data),

  /**
   * Cambia el estado activo/inactivo de un indicio
   * @param id - ID del indicio
   * @param activo - true para activar, false para desactivar
   */
  toggleActivo: (id: number, activo: boolean) =>
    fetcher.patch<Indicio>(`/indicios/${id}/activo`, { activo }),
};

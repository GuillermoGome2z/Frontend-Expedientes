import { fetcher } from "@/shared/fetcher";
import type {
  Indicio,
  IndicioListResponse,
  IndicioFilters,
  CreateIndicioDTO,
  UpdateIndicioDTO,
} from "./indicios.types";

export const indiciosApi = {
  list: (expedienteId: number, filters?: IndicioFilters) =>
    fetcher.get<IndicioListResponse>(`/expedientes/${expedienteId}/indicios`, filters),

  create: (expedienteId: number, data: CreateIndicioDTO) =>
    fetcher.post<{ data: Indicio }>(`/expedientes/${expedienteId}/indicios`, data),

  update: (id: number, data: UpdateIndicioDTO) =>
    fetcher.put<{ data: Indicio }>(`/indicios/${id}`, data),

  toggleActivo: (id: number) =>
    fetcher.patch<{ data: Indicio }>(`/indicios/${id}/activo`, {}),
};

import { apiClient } from "../../../lib/apiClient";
import type { Property, PropertyFilters } from "../types/property.types";

export const propertiesService = {
  getAll: (filters?: PropertyFilters): Promise<Property[]> =>
    apiClient.get<Property[]>("/properties", { params: filters }).then((r) => r.data),

  getById: (id: string): Promise<Property> =>
    apiClient.get<Property>(`/properties/${id}`).then((r) => r.data),
};

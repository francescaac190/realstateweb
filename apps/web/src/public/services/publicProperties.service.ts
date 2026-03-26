import { publicApiClient } from '../lib/publicApiClient';
import type { Property, PropertyFilters } from '../../features/properties/types/property.types';

export const publicPropertiesService = {
  getAll: (filters?: PropertyFilters): Promise<Property[]> =>
    publicApiClient
      .get<Property[]>('/properties', { params: filters })
      .then((r) => r.data),

  getById: (id: string): Promise<Property> =>
    publicApiClient
      .get<Property>(`/properties/${id}`)
      .then((r) => r.data),
};

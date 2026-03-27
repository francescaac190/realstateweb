import { publicApiClient } from "../../../public/lib/publicApiClient";

export interface CatalogItem {
  id: number;
  code: string;
  name: string;
}

export interface City {
  id: number;
  name: string;
}

export interface Zone {
  id: number;
  name: string;
  cityId: number;
}

export const catalogService = {
  getPropertyTypes: (): Promise<CatalogItem[]> =>
    publicApiClient.get<CatalogItem[]>("/catalog/property-types").then((r) => r.data),

  getPropertyStatuses: (): Promise<CatalogItem[]> =>
    publicApiClient.get<CatalogItem[]>("/catalog/property-statuses").then((r) => r.data),

  getCurrencies: (): Promise<CatalogItem[]> =>
    publicApiClient.get<CatalogItem[]>("/catalog/currencies").then((r) => r.data),

  getCities: (): Promise<City[]> =>
    publicApiClient.get<City[]>("/catalog/cities").then((r) => r.data),

  getZones: (cityId?: number): Promise<Zone[]> =>
    publicApiClient
      .get<Zone[]>("/catalog/zones", { params: cityId ? { cityId } : undefined })
      .then((r) => r.data),
};

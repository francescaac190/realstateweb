import { useEffect, useState } from "react";
import { catalogService, type CatalogItem, type City, type Zone } from "../services/catalog.service";

function useCatalogList<T>(fetcher: () => Promise<T[]>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetcher()
      .then((d) => { if (!cancelled) { setData(d); setIsLoading(false); } })
      .catch(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, isLoading };
}

export function usePropertyTypes() {
  return useCatalogList<CatalogItem>(catalogService.getPropertyTypes);
}

export function usePropertyStatuses() {
  return useCatalogList<CatalogItem>(catalogService.getPropertyStatuses);
}

export function useCurrencies() {
  return useCatalogList<CatalogItem>(catalogService.getCurrencies);
}

export function useCities() {
  return useCatalogList<City>(catalogService.getCities);
}

export function useZones(cityId?: number) {
  const [data, setData] = useState<Zone[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setData([]);
    catalogService
      .getZones(cityId)
      .then((d) => { if (!cancelled) { setData(d); setIsLoading(false); } })
      .catch(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [cityId]);

  return { data, isLoading };
}

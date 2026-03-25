import { useEffect, useRef, useState } from "react";
import { propertiesService } from "../services/properties.service";
import type { Property, PropertyFilters } from "../types/property.types";

interface UsePropertiesState {
  data: Property[];
  isLoading: boolean;
  error: string | null;
}

export function useProperties(filters?: PropertyFilters) {
  const [state, setState] = useState<UsePropertiesState>({
    data: [],
    isLoading: true,
    error: null,
  });

  // Stable serialized filters to avoid re-running on every render
  const filtersKey = JSON.stringify(filters ?? {});
  const filtersKeyRef = useRef(filtersKey);
  filtersKeyRef.current = filtersKey;

  useEffect(() => {
    let cancelled = false;

    setState((s) => ({ ...s, isLoading: true, error: null }));

    propertiesService
      .getAll(filters)
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled)
          setState({
            data: [],
            isLoading: false,
            error: err?.message ?? "Error al cargar las propiedades.",
          });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  return state;
}

import { useEffect, useRef, useState } from 'react';
import { publicPropertiesService } from '../services/publicProperties.service';
import type { Property, PropertyFilters } from '../../features/properties/types/property.types';

interface State {
  data: Property[];
  isLoading: boolean;
  error: string | null;
}

export function usePublicProperties(filters?: PropertyFilters) {
  const [state, setState] = useState<State>({ data: [], isLoading: true, error: null });

  const filtersKey = JSON.stringify(filters ?? {});
  const filtersKeyRef = useRef(filtersKey);
  filtersKeyRef.current = filtersKey;

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, isLoading: true, error: null }));

    publicPropertiesService
      .getAll(filters)
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled)
          setState({ data: [], isLoading: false, error: err?.message ?? 'Error al cargar propiedades.' });
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  return state;
}

import { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/apiClient';
import type { Property } from '../types/property.types';

interface State {
  data: Property[];
  isLoading: boolean;
  error: string | null;
}

export function useAgentProperties(agentId: string | null) {
  const [state, setState] = useState<State>({ data: [], isLoading: false, error: null });

  useEffect(() => {
    if (!agentId) {
      setState({ data: [], isLoading: false, error: null });
      return;
    }

    let cancelled = false;
    setState({ data: [], isLoading: true, error: null });

    apiClient
      .get<Property[]>(`/users/${agentId}/properties`)
      .then((r) => {
        if (!cancelled) setState({ data: r.data, isLoading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled)
          setState({ data: [], isLoading: false, error: err?.message ?? 'Error al cargar propiedades.' });
      });

    return () => { cancelled = true; };
  }, [agentId]);

  return state;
}

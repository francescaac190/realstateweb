import { useEffect, useState } from 'react';
import { publicAgentsService } from '../services/publicAgents.service';
import type { PublicAgent } from '../types/agent.types';

interface State {
  data: PublicAgent[];
  isLoading: boolean;
  error: string | null;
}

export function usePublicAgents() {
  const [state, setState] = useState<State>({ data: [], isLoading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    publicAgentsService
      .getAll()
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ data: [], isLoading: false, error: err?.message ?? 'Error.' });
      });
    return () => { cancelled = true; };
  }, []);

  return state;
}

export function usePublicAgent(id: string) {
  const [state, setState] = useState<{ data: PublicAgent | null; isLoading: boolean; error: string | null }>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    publicAgentsService
      .getById(id)
      .then((data) => {
        if (!cancelled) setState({ data: data ?? null, isLoading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ data: null, isLoading: false, error: err?.message ?? 'Error.' });
      });
    return () => { cancelled = true; };
  }, [id]);

  return state;
}

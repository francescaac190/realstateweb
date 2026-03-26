import { useEffect, useState } from 'react';
import { usersService, type Agent } from '../services/users.service';

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    usersService
      .listAgents()
      .then((data) => { if (!cancelled) { setAgents(data); setIsLoading(false); } })
      .catch(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { agents, isLoading };
}

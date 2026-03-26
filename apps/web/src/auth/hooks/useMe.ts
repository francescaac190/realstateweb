import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { apiClient } from '../../lib/apiClient';
import type { User } from '../types/auth.types';

/**
 * Returns the current user's profile.
 * Uses the in-memory user from AuthContext when available (fresh login).
 * Falls back to GET /users/me when the session was restored from a refresh
 * token and user is null.
 */
export function useMe() {
  const { user: contextUser, isAuthenticated } = useAuth();
  const [me, setMe] = useState<User | null>(contextUser);
  const [isLoading, setIsLoading] = useState(!contextUser && isAuthenticated);

  useEffect(() => {
    if (contextUser) {
      setMe(contextUser);
      setIsLoading(false);
      return;
    }

    if (!isAuthenticated) {
      setMe(null);
      setIsLoading(false);
      return;
    }

    // Authenticated but user not yet loaded — fetch from /users/me
    let cancelled = false;
    setIsLoading(true);
    apiClient
      .get<User>('/users/me')
      .then((r) => { if (!cancelled) { setMe(r.data); setIsLoading(false); } })
      .catch(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [contextUser, isAuthenticated]);

  return { me, isLoading };
}

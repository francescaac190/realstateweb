import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { setAccessToken } from '../../lib/apiClient';
import { authService } from '../services/authService';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // On mount: silently restore session from a stored refresh token
  useEffect(() => {
    const storedRefresh = localStorage.getItem('refreshToken');
    if (!storedRefresh) {
      setState((s) => ({ ...s, isLoading: false }));
      return;
    }

    authService
      .refresh(storedRefresh)
      .then(({ accessToken, refreshToken }) => {
        setAccessToken(accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        // accessToken is in-memory; user data can be fetched via a /me endpoint when needed
        setState({ user: null, isAuthenticated: true, isLoading: false });
      })
      .catch(() => {
        localStorage.removeItem('refreshToken');
        setState({ user: null, isAuthenticated: false, isLoading: false });
      });
  }, []);

  // Forced logout dispatched by the API client when refresh itself fails
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  });

  const login = useCallback(async (email: string, password: string) => {
    const { user, accessToken, refreshToken } = await authService.login({ email, password });
    setAccessToken(accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    const storedRefresh = localStorage.getItem('refreshToken');
    if (storedRefresh) {
      authService.logout(storedRefresh).catch(() => {}); // fire-and-forget
    }
    setAccessToken(null);
    localStorage.removeItem('refreshToken');
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

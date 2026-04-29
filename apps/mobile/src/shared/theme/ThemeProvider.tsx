import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { tokens, type Tokens } from './tokens';

export type Theme = Tokens;

const ThemeContext = createContext<Theme | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
  theme?: Theme;
};

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const value = useMemo(() => theme ?? tokens, [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}

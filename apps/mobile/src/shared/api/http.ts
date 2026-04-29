import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@app/config/env';
import { HTTP_TIMEOUT_MS } from '@app/config/constants';
import { AppError } from './error';

type TokenGetter = () => string | null | Promise<string | null>;

let tokenGetter: TokenGetter = () => null;

export function setAuthTokenGetter(getter: TokenGetter) {
  tokenGetter = getter;
}

export const http = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL,
  timeout: HTTP_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await tokenGetter();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string; errors?: unknown }>) => {
    if (error.response) {
      const { status, data } = error.response;
      throw AppError.fromStatus(status, data?.message, data?.errors);
    }
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      throw new AppError('NETWORK', 'Network unavailable', { cause: error });
    }
    throw new AppError('UNKNOWN', error.message ?? 'Unknown error', { cause: error });
  },
);

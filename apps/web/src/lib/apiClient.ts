import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

// In-memory access token — never stored in localStorage to reduce XSS exposure
let _accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  _accessToken = token;
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every outgoing request
apiClient.interceptors.request.use((config) => {
  if (_accessToken) {
    config.headers.Authorization = `Bearer ${_accessToken}`;
  }
  return config;
});

// Queue of requests waiting while a token refresh is in progress
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

// On 401: attempt a silent token refresh, then retry the original request
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // If a refresh is already running, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return apiClient(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    const storedRefresh = localStorage.getItem('refreshToken');
    if (!storedRefresh) {
      isRefreshing = false;
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken: storedRefresh,
      });

      setAccessToken(data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      processQueue(null, data.accessToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      setAccessToken(null);
      localStorage.removeItem('refreshToken');
      window.dispatchEvent(new Event('auth:logout'));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

import { apiClient } from '../../lib/apiClient';
import type { AuthResponse, LoginRequest, RefreshResponse } from '../types/auth.types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const response = await apiClient.post<RefreshResponse>('/auth/refresh', { refreshToken });
    return response.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post('/auth/logout', { refreshToken });
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', { currentPassword, newPassword });
  },
};

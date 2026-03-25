export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  username: string;
  roleId: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  cityId: number | null;
  branchId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

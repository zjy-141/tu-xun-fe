import client from './client';
import type { ApiResponse, User, RegisterForm, LoginForm } from '../types';

export const authApi = {
  register: (data: RegisterForm) =>
    client.post<ApiResponse<User>>('/auth/register', data),

  login: (data: LoginForm) =>
    client.post<ApiResponse<User>>('/auth/login', data),

  logout: () =>
    client.post<ApiResponse<null>>('/auth/logout'),

  me: () =>
    client.get<ApiResponse<User>>('/auth/me'),
};

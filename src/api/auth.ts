import client from './client'
import type { ApiResponse, User, RegisterParams, LoginParams } from '../types'

export const authApi = {
  /** POST /api/auth/register */
  register: (data: RegisterParams) =>
    client.post<ApiResponse<User>>('/auth/register', data),

  /** POST /api/auth/login */
  login: (data: LoginParams) =>
    client.post<ApiResponse<User>>('/auth/login', data),

  /** DELETE /api/auth/logout */
  logout: () =>
    client.delete<ApiResponse<null>>('/auth/logout'),

  /** GET /api/auth/me */
  me: () =>
    client.get<ApiResponse<User>>('/auth/me'),
}

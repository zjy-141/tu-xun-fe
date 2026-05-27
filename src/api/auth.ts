import client from './client'
import type { ApiResponse, User, RegisterParams, LoginParams } from '../types'

export const authApi = {
  register: (data: RegisterParams) =>
    client.post<ApiResponse<User>>('/auth/register', data),

  login: (data: LoginParams) =>
    client.post<ApiResponse<User>>('/auth/login', data),

  logout: () =>
    client.delete<ApiResponse<null>>('/auth/logout'),

  me: () =>
    client.get<ApiResponse<User>>('/auth/me'),

  changePassword: (data: { old_password: string; new_password: string }) =>
    client.put<ApiResponse<null>>('/auth/password', data),

  updateProfile: (data: Record<string, string>) =>
    client.put<ApiResponse<User>>('/auth/profile', data),

  updateDescription: (data: { description: string }) =>
    client.put<ApiResponse<string>>('/auth/description', data),

  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return client.post<ApiResponse<{ avatar_url: string }>>('/auth/avatar', formData)
  },

  getUserProfile: (userId: number) =>
    client.get<ApiResponse<import('../types').UserProfileResponse>>(`/users/${userId}`),
}
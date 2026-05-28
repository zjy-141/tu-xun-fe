import client from './client'
import type { ApiResponse, MyPrizesData } from '../types'

export const prizesApi = {
  getMyPrizes: (params?: { page?: number; limit?: number }) =>
    client.get<ApiResponse<MyPrizesData>>('/users/me/prizes', { params: { page: params?.page || 1, limit: params?.limit || 20 } }),
}
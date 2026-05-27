import client from './client'
import type { ApiResponse, MyPrizesData } from '../types'

export const prizesApi = {
  getMyPrizes: () =>
    client.get<ApiResponse<MyPrizesData>>('/users/me/prizes'),
}
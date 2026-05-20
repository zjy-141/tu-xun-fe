import client from './client'
import type { ApiResponse, MyPrizesData } from '../types'

export const prizesApi = {
  /** GET /api/users/me/prizes — 我的奖品 */
  getMyPrizes: () =>
    client.get<ApiResponse<MyPrizesData>>('/users/me/prizes'),
}

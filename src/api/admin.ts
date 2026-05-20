import client from './client'
import type {
  ApiResponse,
  PaginatedData,
  PendingPhoto,
  PendingAttempt,
  ReviewForm,
  ReviewPhotoResponse,
  ReviewAttemptResponse,
  ClaimPrizeResponse,
} from '../types'

export const adminApi = {
  /** GET /api/admin/photos/pending — 待审核图片列表 */
  getPendingPhotos: (params?: { page?: number; limit?: number }) =>
    client.get<ApiResponse<PaginatedData<PendingPhoto>>>('/admin/photos/pending', { params }),

  /** PUT /api/admin/photos/:id/review — 审核图片 */
  reviewPhoto: (photoId: number, data: ReviewForm) =>
    client.put<ApiResponse<ReviewPhotoResponse>>(
      `/admin/photos/${photoId}/review`,
      data,
    ),

  /** GET /api/admin/attempts/pending — 待审核答题列表 */
  getPendingAttempts: (params?: { page?: number; limit?: number }) =>
    client.get<ApiResponse<PaginatedData<PendingAttempt>>>('/admin/attempts/pending', { params }),

  /** PUT /api/admin/attempts/:id/review — 审核答题 */
  reviewAttempt: (attemptId: number, data: ReviewForm) =>
    client.put<ApiResponse<ReviewAttemptResponse>>(
      `/admin/attempts/${attemptId}/review`,
      data,
    ),

  /** PUT /api/admin/prizes/:id/claim — 标记奖品已发放 */
  claimPrize: (prizeId: number) =>
    client.put<ApiResponse<ClaimPrizeResponse>>(`/admin/prizes/${prizeId}/claim`),
}

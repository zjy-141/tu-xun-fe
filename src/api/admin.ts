import client from './client'
import type {
  ApiResponse,
  PendingPhotosResponse,
  PendingAttemptsResponse,
  ReviewForm,
  ReviewPhotoResponse,
  ReviewAttemptResponse,
  ClaimPrizeResponse,
  AdminPrizesResponse,
  PendingCommentsResponse,
  ReviewCommentResponse,
  UpdateAdminLevelResponse,
} from '../types'

export const adminApi = {
  getPendingPhotos: (params?: { page?: number; limit?: number; status?: string }) =>
    client.get<ApiResponse<PendingPhotosResponse>>('/admin/photos/pending', { params: { page: params?.page || 1, limit: params?.limit || 20, status: params?.status || 'pending' } }),

  reviewPhoto: (photoId: number, data: ReviewForm) =>
    client.put<ApiResponse<ReviewPhotoResponse>>(`/admin/photos/${photoId}/review`, data),

  getPendingAttempts: (params?: { page?: number; limit?: number; status?: string }) =>
    client.get<ApiResponse<PendingAttemptsResponse>>('/admin/attempts/pending', { params: { page: params?.page || 1, limit: params?.limit || 20, status: params?.status || 'pending' } }),

  reviewAttempt: (attemptId: number, data: ReviewForm & { solved?: string }) =>
    client.put<ApiResponse<ReviewAttemptResponse>>(`/admin/attempts/${attemptId}/review`, data),

  claimPrize: (prizeId: number) =>
    client.put<ApiResponse<ClaimPrizeResponse>>(`/admin/prizes/${prizeId}/claim`),

  getPrizes: (params?: { page?: number; limit?: number; status?: string }) =>
    client.get<ApiResponse<AdminPrizesResponse>>('/admin/prizes', { params }),

  getPendingComments: (params?: { page?: number; limit?: number }) =>
    client.get<ApiResponse<PendingCommentsResponse>>('/admin/comments/pending', { params }),

  reviewComment: (commentId: number, data: ReviewForm) =>
    client.put<ApiResponse<ReviewCommentResponse>>(`/admin/comments/${commentId}/review`, data),

  updateAdminLevel: (userId: number, data: { target_level: number }) =>
    client.put<ApiResponse<UpdateAdminLevelResponse>>(`/admin/admins/${userId}/level`, data),
}
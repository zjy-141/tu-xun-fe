import client from './client';
import type {
  ApiResponse,
  PaginatedData,
  PendingPhoto,
  PendingAttempt,
  ReviewForm,
  ReviewAttemptResponse,
  PhotoDetail,
  Prize,
} from '../types';

export const adminApi = {
  // 获取待审核图片列表
  getPendingPhotos: (params?: { page?: number; limit?: number }) =>
    client.get<ApiResponse<PaginatedData<PendingPhoto>>>('/admin/photos/pending', { params }),

  // 审核图片
  reviewPhoto: (photoId: number, data: ReviewForm) =>
    client.put<ApiResponse<{ id: number; status: string; message: string }>>(
      `/admin/photos/${photoId}/review`,
      data
    ),

  // 获取待审核答题记录
  getPendingAttempts: (params?: { page?: number; limit?: number }) =>
    client.get<ApiResponse<PaginatedData<PendingAttempt>>>('/admin/attempts/pending', { params }),

  // 审核答题记录
  reviewAttempt: (attemptId: number, data: ReviewForm) =>
    client.put<ApiResponse<ReviewAttemptResponse>>(
      `/admin/attempts/${attemptId}/review`,
      data
    ),

  // 标记奖品已发放
  claimPrize: (prizeId: number) =>
    client.put<ApiResponse<{ prize_id: number; status: string }>>(
      `/admin/prizes/${prizeId}/claim`
    ),
};

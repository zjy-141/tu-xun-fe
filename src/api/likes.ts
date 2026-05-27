import client from './client'
import type { ApiResponse, ToggleLikeResponse, LikeStatusResponse } from '../types'

export const likesApi = {
  togglePhotoLike: (photoId: number) =>
    client.post<ApiResponse<ToggleLikeResponse>>(`/photos/${photoId}/like`),

  getPhotoLikeStatus: (photoId: number) =>
    client.get<ApiResponse<LikeStatusResponse>>(`/photos/${photoId}/like`),

  toggleCommentLike: (commentId: number) =>
    client.post<ApiResponse<ToggleLikeResponse>>(`/comments/${commentId}/like`),

  getCommentLikeStatus: (commentId: number) =>
    client.get<ApiResponse<LikeStatusResponse>>(`/comments/${commentId}/like`),

  toggleAttemptLike: (attemptId: number) =>
    client.post<ApiResponse<ToggleLikeResponse>>(`/attempts/${attemptId}/like`),

  getAttemptLikeStatus: (attemptId: number) =>
    client.get<ApiResponse<LikeStatusResponse>>(`/attempts/${attemptId}/like`),
}
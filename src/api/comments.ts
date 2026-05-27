import client from './client'
import type { ApiResponse, CreateCommentResponse, CommentListResponse } from '../types'

export const commentsApi = {
  create: (photoId: number, data: { comment_text: string }) =>
    client.post<ApiResponse<CreateCommentResponse>>(`/photos/${photoId}/comments`, data),

  listByPhoto: (photoId: number, params?: { page?: number; limit?: number; sort_by?: string }) =>
    client.get<ApiResponse<CommentListResponse>>(`/photos/${photoId}/comments`, { params }),
}
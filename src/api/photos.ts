import client from './client'
import type {
  ApiResponse,
  PhotoListResponse,
  PhotoDetail,
  UploadPhotoForm,
  UploadedPhoto,
  CommentListResponse,
  AttemptListResponse,
} from '../types'

export const photosApi = {
  upload: (data: UploadPhotoForm) => {
    const formData = new FormData()
    formData.append('image', data.image)
    formData.append('title', data.title)
    if (data.description) formData.append('description', data.description)
    formData.append('location_secret', data.location_secret)
    return client.post<ApiResponse<UploadedPhoto>>('/photos', formData)
  },

  list: (params?: { page?: number; limit?: number; solved?: boolean; sort_by?: string }) =>
    client.get<ApiResponse<PhotoListResponse>>('/photos', { params }),

  detail: (id: number) =>
    client.get<ApiResponse<PhotoDetail>>(`/photos/${id}`),

  comments: (id: number, params?: { page?: number; limit?: number; sort_by?: string }) =>
    client.get<ApiResponse<CommentListResponse>>(`/photos/${id}/comments`, { params }),

  attempts: (id: number, params?: { page?: number; limit?: number; sort_by?: string }) =>
    client.get<ApiResponse<AttemptListResponse>>(`/photos/${id}/attempts`, { params }),

  userPhotos: (userId: number, params?: { page?: number; limit?: number; sort_by?: string }) =>
    client.get<ApiResponse<PhotoListResponse>>(`/users/${userId}/photos`, { params }),
}
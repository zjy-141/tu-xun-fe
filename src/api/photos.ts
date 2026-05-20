import client from './client'
import type {
  ApiResponse,
  PaginatedData,
  PhotoListItem,
  PhotoDetail,
  UploadPhotoForm,
  UploadedPhoto,
} from '../types'

export const photosApi = {
  /** POST /api/photos — 上传图片投稿 (multipart/form-data) */
  upload: (data: UploadPhotoForm) => {
    const formData = new FormData()
    formData.append('image', data.image)
    formData.append('title', data.title)
    if (data.description) formData.append('description', data.description)
    formData.append('location_secret', data.location_secret)
    return client.post<ApiResponse<UploadedPhoto>>('/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  /** GET /api/photos — 图片列表（仅已审核通过的） */
  list: (params?: { page?: number; limit?: number; solved?: boolean }) =>
    client.get<ApiResponse<PaginatedData<PhotoListItem>>>('/photos', { params }),

  /** GET /api/photos/:id — 图片详情 */
  detail: (id: number) =>
    client.get<ApiResponse<PhotoDetail>>(`/photos/${id}`),
}

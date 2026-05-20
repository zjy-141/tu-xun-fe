import client from './client'
import type {
  ApiResponse,
  StoriesData,
  CreateStoryForm,
  StoryCreated,
  StoryMediaResponse,
} from '../types'

export const storiesApi = {
  /** POST /api/photos/:id/stories — 发布故事 */
  create: (photoId: number, data: CreateStoryForm) =>
    client.post<ApiResponse<StoryCreated>>(`/photos/${photoId}/stories`, data),

  /** GET /api/photos/:id/stories — 获取图片下的故事列表 */
  listByPhoto: (photoId: number) =>
    client.get<ApiResponse<StoriesData>>(`/photos/${photoId}/stories`),

  /** POST /api/stories/media — 上传故事媒体文件 (multipart/form-data) */
  uploadMedia: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return client.post<ApiResponse<StoryMediaResponse>>('/stories/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

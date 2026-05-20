import client from './client'
import type {
  ApiResponse,
  SubmitAttemptForm,
  SubmitAttemptResponse,
  MyAttemptsData,
} from '../types'

export const attemptsApi = {
  /** POST /api/photos/:id/attempts — 提交答题 (multipart/form-data) */
  submit: (photoId: number, data: SubmitAttemptForm) => {
    const formData = new FormData()
    formData.append('image', data.image)
    formData.append('guessed_location', data.guessed_location)
    return client.post<ApiResponse<SubmitAttemptResponse>>(
      `/photos/${photoId}/attempts`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
  },

  /** GET /api/photos/:id/my-attempts — 获取我对某图片的答题记录 */
  myAttempts: (photoId: number) =>
    client.get<ApiResponse<MyAttemptsData>>(`/photos/${photoId}/my-attempts`),
}

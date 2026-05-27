import client from './client'
import type {
  ApiResponse,
  SubmitAttemptForm,
  SubmitAttemptResponse,
  MyAttemptsData,
  AttemptListResponse,
} from '../types'

export const attemptsApi = {
  submit: (photoId: number, data: SubmitAttemptForm) => {
    const formData = new FormData()
    formData.append('image', data.image)
    formData.append('guessed_location', data.guessed_location)
    return client.post<ApiResponse<SubmitAttemptResponse>>(
      `/photos/${photoId}/attempts`,
      formData,
    )
  },

  myAttempts: (photoId: number) =>
    client.get<ApiResponse<MyAttemptsData>>(`/photos/${photoId}/my-attempts`),

  userAttempts: (userId: number, params?: { page?: number; limit?: number; sort_by?: string }) =>
    client.get<ApiResponse<AttemptListResponse>>(`/users/${userId}/attempts`, { params }),
}
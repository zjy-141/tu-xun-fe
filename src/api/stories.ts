import client from './client'
import type { ApiResponse, StoriesData, CreateStoryForm, StoryCreated } from '../types'

export const storiesApi = {
  create: (photoId: number, data: CreateStoryForm) =>
    client.post<ApiResponse<StoryCreated>>(`/photos/${photoId}/stories`, data),

  listByPhoto: (photoId: number) =>
    client.get<ApiResponse<StoriesData>>(`/photos/${photoId}/stories`),
}
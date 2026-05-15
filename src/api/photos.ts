import client from './client';
import type {
  ApiResponse,
  PaginatedData,
  PhotoListItem,
  PhotoDetail,
  UploadPhotoForm,
  UploadedPhoto,
  SubmitAttemptForm,
  SubmitAttemptResponse,
  MyAttemptsData,
  Story,
  StoryCreated,
  StoryForm,
  StoryMediaResponse,
} from '../types';

export const photosApi = {
  // 上传图片（投稿）
  upload: (data: UploadPhotoForm) => {
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('location_secret', data.location_secret);
    return client.post<ApiResponse<UploadedPhoto>>('/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // 获取图片列表
  list: (params?: { page?: number; limit?: number; solved?: boolean }) =>
    client.get<ApiResponse<PaginatedData<PhotoListItem>>>('/photos', { params }),

  // 获取图片详情
  detail: (id: number) =>
    client.get<ApiResponse<PhotoDetail>>(`/photos/${id}`),

  // 提交答案
  submitAttempt: (photoId: number, data: SubmitAttemptForm) => {
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('guessed_location', data.guessed_location);
    return client.post<ApiResponse<SubmitAttemptResponse>>(
      `/photos/${photoId}/attempts`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  // 获取我的答题记录
  myAttempts: (photoId: number) =>
    client.get<ApiResponse<MyAttemptsData>>(`/photos/${photoId}/my-attempts`),

  // 发布故事
  postStory: (photoId: number, data: StoryForm) =>
    client.post<ApiResponse<StoryCreated>>(`/photos/${photoId}/stories`, data),

  // 获取故事列表
  getStories: (photoId: number) =>
    client.get<ApiResponse<{ stories: Story[] }>>(`/photos/${photoId}/stories`),

  // 上传故事媒体
  uploadStoryMedia: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return client.post<ApiResponse<StoryMediaResponse>>('/stories/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

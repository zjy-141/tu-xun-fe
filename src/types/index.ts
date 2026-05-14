// ========== 通用类型 ==========

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  code: number;
}

export interface PaginatedData<T> {
  total: number;
  page: number;
  limit: number;
  items: T[];
}

export interface PagerParams {
  page?: number;
  limit?: number;
}

// ========== 用户相关 ==========

export interface User {
  id: number;
  student_id: string;
  name: string;
  level: number;
  prize_count?: number;
}

export interface RegisterForm {
  student_id: string;
  name: string;
  password: string;
  email: string;
}

export interface LoginForm {
  student_id: string;
  password: string;
}

// ========== 图片相关 ==========

export type PhotoStatus = 'pending' | 'approved' | 'rejected';

export interface PhotoAuthor {
  id: number;
  name: string;
}

export interface PhotoListItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  author: PhotoAuthor;
  solved: boolean;
  attempts_count: number;
  created_at: string;
}

export interface PhotoWinner {
  user_id: number;
  name: string;
  created_at: string;
}

export interface CurrentUserAttempt {
  id: number;
  status: AttemptStatus;
  is_winner: boolean;
}

export interface PhotoDetail {
  id: number;
  title: string;
  description: string;
  image_url: string;
  author: PhotoAuthor;
  solved: boolean;
  winner: PhotoWinner | null;
  attempts_count: number;
  current_user_attempt: CurrentUserAttempt | null;
  created_at: string;
}

export interface UploadPhotoForm {
  image: File;
  title: string;
  description?: string;
  location_secret: string;
}

// ========== 答题相关 ==========

export type AttemptStatus = 'pending' | 'approved' | 'rejected';

export interface SubmitAttemptForm {
  image: File;
  guessed_location: string;
}

export interface SubmitAttemptResponse {
  attempt_id: number;
  photo_id: number;
  status: AttemptStatus;
  message: string;
}

export interface MyAttempt {
  id: number;
  image_url: string;
  guessed_location: string;
  status: AttemptStatus;
  is_winner: boolean;
  reviewed_at: string | null;
}

export interface MyAttemptsData {
  photo_id: number;
  solved: boolean;
  my_attempts: MyAttempt[];
}

// ========== 管理审核相关 ==========

export type ReviewAction = 'approve' | 'reject';

export interface ReviewForm {
  action: ReviewAction;
  reject_reason?: string;
}

export interface PendingPhoto {
  id: number;
  title: string;
  location_secret: string;
  author: PhotoAuthor;
  created_at: string;
}

export interface PendingAttempt {
  attempt_id: number;
  photo_id: number;
  photo_title: string;
  user: PhotoAuthor;
  image_url: string;
  guessed_location: string;
  submitted_at: string;
}

export interface ReviewAttemptResponse {
  attempt_id: number;
  status: AttemptStatus;
  is_winner: boolean;
  photo_solved: boolean;
  message: string;
}

// ========== 奖品相关 ==========

export type PrizeStatus = 'unclaimed' | 'claimed';

export interface Prize {
  id: number;
  photo_id: number;
  photo_title: string;
  status: PrizeStatus;
  prize_type: string;
  awarded_at: string;
}

// ========== 故事相关 ==========

export interface Story {
  id: number;
  user_name: string;
  content: string;
  media_url: string | null;
  likes: number;
  created_at: string;
}

export interface StoryForm {
  content: string;
  media_url?: string;
}

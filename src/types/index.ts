export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
  code?: number
}

export interface PagerParams {
  page?: number
  limit?: number
}

export interface PaginatedData<T> {
  total: number
  items: T[]
}

export interface User {
  id: number
  student_id: string
  name: string
  avatar_url: string
  email: string
  phone: string
  level: number
  qq: string
  weixin: string
  gender?: string
  prize_count?: number
  description?: string
  photo_count?: number
  attempt_count?: number
}

export interface UserBrief {
  id: number
  name: string
  avatar_url: string
}

export interface RegisterParams {
  student_id: string
  name: string
  password: string
  gender: string
  phone: string
  email?: string
  qq?: string
  weixin?: string
}

export interface LoginParams {
  student_id: string
  password: string
}

export type PhotoStatus = 'pending' | 'approved' | 'rejected'

export interface PhotoListItem {
  id: number
  title: string
  description: string
  thumb_url: string
  author: UserBrief
  solved: boolean
  created_at: string
  attempts_count: number
  likes_count: number
}

export interface PhotoListResponse {
  total: number
  photos: PhotoListItem[]
}

export interface PhotoDetail {
  id: number
  title: string
  description: string
  image_url: string
  author: UserBrief
  status?: string
  solved: boolean
  attempts_count: number
  likes_count: number
  created_at: string
  winner?: AttemptForm
  current_user_attempt?: CurrentUserAttempt
}

export interface CurrentUserAttempt {
  id: number
  status: AttemptStatus
  solved: number
}

export interface UploadPhotoForm {
  image: File
  title: string
  description?: string
  location_secret: string
}

export interface UploadedPhoto {
  id: number
  message: string
}

export type AttemptStatus = 'pending' | 'approved' | 'rejected'

export interface AttemptForm {
  id: number
  image_url: string
  comment?: string
  guessed_location: string
  likes_count: number
  created_at: string
  user: UserBrief
}

export interface AttemptListResponse {
  total: number
  attempts: AttemptForm[]
}

export interface SubmitAttemptForm {
  image: File
  guessed_location: string
}

export interface SubmitAttemptResponse {
  attempt_id: number
  photo_id: number
  status: AttemptStatus
  message: string
}

export interface MyAttempt {
  id: number
  image_url: string
  guessed_location: string
  status: AttemptStatus
  solved: number
  reviewed_at: string | null
}

export interface MyAttemptsData {
  photo_id: number
  solved: boolean
  my_attempts: MyAttempt[]
}

export interface CommentForm {
  id: number
  content: string
  likes_count: number
  created_at: string
  user: UserBrief
}

export interface CommentListResponse {
  total: number
  comments: CommentForm[]
}

export interface CreateCommentResponse {
  id: number
  message: string
}

export type ReviewAction = 'approve' | 'reject'

export interface ReviewForm {
  action: ReviewAction
  reject_reason?: string
}

export interface PendingPhoto {
  id: number
  title: string
  description: string
  location_secret: string
  thumb_url: string
  author: UserBrief
  created_at: string
}

export interface PendingPhotosResponse {
  total: number
  photos: PendingPhoto[]
}

export interface ReviewPhotoResponse {
  id: number
  status: PhotoStatus
  message: string
}

export interface PendingAttempt {
  attempt_id: number
  photo_id: number
  photo_title: string
  user?: UserBrief
  user_id?: number
  user_name?: string
  image_url: string
  guessed_location: string
  thumb_url: string
  location_secret: string
  submitted_at: string
  solved?: number
}

export interface PendingAttemptsResponse {
  total: number
  items: PendingAttempt[]
}

export interface ReviewAttemptResponse {
  attempt_id: number
  status: AttemptStatus
  solved: number
  photo_solved: boolean
  message: string
}

export interface ClaimPrizeResponse {
  prize_id: number
  status: string
}

export interface AdminPrizeItem {
  id: number
  photo_id: number
  photo_title: string
  user_id: number
  user_name: string
  status: string
  prize_type: string
  awarded_at: string | null
}

export interface AdminPrizesResponse {
  total: number
  prizes: AdminPrizeItem[]
}

export type PrizeStatus = 'unclaimed' | 'claimed'

export interface PrizeItem {
  id: number
  photo_id: number
  photo_title: string
  status: PrizeStatus
  prize_type: string
  awarded_at: string
}

export interface MyPrizesData {
  total: number
  prizes: PrizeItem[]
}

export interface ToggleLikeResponse {
  liked: boolean
  count: number
}

export interface LikeStatusResponse {
  liked: boolean
  count: number
}

export interface MessageItem {
  id: number
  type: string
  title: string
  content: string
  related_id: number
  related_type: string
  is_read: boolean
  created_at: string
}

export interface MessagesResponse {
  total: number
  messages: MessageItem[]
}

export interface UnreadCountResponse {
  count: number
}

export interface ConversationItem {
  partner_id: number
  partner_name: string
  partner_avatar: string
  last_content: string
  last_time: string
  unread_count: number
}

export interface ConversationDetailResponse {
  partner: UserBrief
  messages: ChatMessage[]
  total: number
}

export interface ChatMessage {
  id: number
  sender_id: number
  content: string
  is_mine: boolean
  type: string
  created_at: string
}

export interface PendingCommentItem {
  comment_id: number
  photo_id: number
  photo_title: string
  user: UserBrief
  comment: string
  created_at: string
}

export interface PendingCommentsResponse {
  total: number
  items: PendingCommentItem[]
}

export interface ReviewCommentResponse {
  comment_id: number
  status: string
  message: string
}

export interface UpdateAdminLevelResponse {
  user_id: number
  name: string
  old_level: number
  new_level: number
  message: string
}

export interface UserProfileResponse {
  id: number
  name: string
  avatar_url: string
  gender?: string
  level: number
  description: string
  prize_count: number
  photo_count: number
  attempt_count: number
}

export interface ChangePasswordParams {
  old_password: string
  new_password: string
}

export interface UpdateProfileParams {
  name?: string
  gender?: string
  phone?: string
  email?: string
  qq?: string
  weixin?: string
}

export interface PendingPhotoForm {
  id: number
  title: string
  description: string
  location_secret: string
  thumb_url: string
  author: UserBrief
  created_at: string
}

export interface CommentLikeResponse {
  liked: boolean
  count: number
}

export interface AttemptLikeResponse {
  liked: boolean
  count: number
}

export interface StoryItem {
  id: number
  user_name: string
  content: string
  media_url: string | null
  likes: number
  created_at: string
}

export interface StoriesData {
  stories: StoryItem[]
}

export interface CreateStoryForm {
  content: string
  media_url?: string
}

export interface StoryCreated {
  id: number
  photo_id: number
  user_id: number
  content: string
  media_url: string
  likes: number
  user?: User
}

export interface StoryMediaResponse {
  media_url: string
}
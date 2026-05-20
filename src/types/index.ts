// ============================================================
// 通用类型
// ============================================================

/** 后端统一响应包装 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
  code?: number
}

/** 分页数据（Photos 列表返回 page/limit；Admin 列表仅返回 total/items） */
export interface PaginatedData<T> {
  total: number
  page?: number
  limit?: number
  items: T[]
}

/** 分页查询参数 */
export interface PagerParams {
  page?: number
  limit?: number
}

// ============================================================
// 用户相关 (对应 model.User，注意 BaseModel 的 create/update/delete 均为 json:"-")
// ============================================================

export interface User {
  id: number
  student_id: string
  name: string
  email: string
  level: number          // 0=普通用户, >=1=管理员
  prize_count: number
}

export interface UserBrief {
  id: number
  name: string
}

/** POST /api/auth/register 请求体 */
export interface RegisterParams {
  student_id: string
  name: string
  password: string
  email: string
}

/** POST /api/auth/login 请求体 */
export interface LoginParams {
  student_id: string
  password: string
}

// ============================================================
// 图片相关 (对应 model.Photo)
// ============================================================

export type PhotoStatus = 'pending' | 'approved' | 'rejected'

/** GET /api/photos 列表项 */
export interface PhotoListItem {
  id: number
  title: string
  description: string
  image_url: string        // 列表中使用缩略图 thumb_url
  author: UserBrief
  solved: boolean
  attempts_count: number
  created_at: string
}

/** GET /api/photos/:id 详情 */
export interface PhotoDetail {
  id: number
  title: string
  description: string
  image_url: string        // 原图
  author: UserBrief
  solved: boolean
  attempts_count: number
  created_at: string
  winner?: PhotoWinner
  current_user_attempt?: CurrentUserAttempt
}

export interface PhotoWinner {
  user_id: number
  name: string
  created_at: string
}

export interface CurrentUserAttempt {
  id: number
  status: AttemptStatus
  is_winner: boolean
}

/** POST /api/photos 上传表单 */
export interface UploadPhotoForm {
  image: File
  title: string
  description?: string
  location_secret: string
}

/** POST /api/photos 上传成功响应 (model.Photo 的 JSON 序列化结果) */
export interface UploadedPhoto {
  id: number
  user_id: number
  title: string
  description: string
  image_url: string
  thumb_url: string
  status: PhotoStatus
  solved: boolean
  attempts_count: number
  author?: User
}

// ============================================================
// 答题相关 (对应 model.Attempt)
// ============================================================

export type AttemptStatus = 'pending' | 'approved' | 'rejected'

/** POST /api/photos/:id/attempts 提交表单 (multipart/form-data) */
export interface SubmitAttemptForm {
  image: File
  guessed_location: string
}

/** POST /api/photos/:id/attempts 响应 */
export interface SubmitAttemptResponse {
  attempt_id: number
  photo_id: number
  status: AttemptStatus
  message: string
}

/** GET /api/photos/:id/my-attempts 单项 */
export interface MyAttempt {
  id: number
  image_url: string
  guessed_location: string
  status: AttemptStatus
  is_winner: boolean
  reviewed_at: string | null
}

/** GET /api/photos/:id/my-attempts 响应 data */
export interface MyAttemptsData {
  photo_id: number
  solved: boolean
  my_attempts: MyAttempt[]
}

// ============================================================
// 审核相关 (Admin)
// ============================================================

export type ReviewAction = 'approve' | 'reject'

export interface ReviewForm {
  action: ReviewAction
  reject_reason?: string
}

/** GET /api/admin/photos/pending 列表项 */
export interface PendingPhoto {
  id: number
  title: string
  location_secret: string
  author: UserBrief
  created_at: string
}

/** PUT /api/admin/photos/:id/review 响应 */
export interface ReviewPhotoResponse {
  id: number
  status: PhotoStatus
  message: string
}

/** GET /api/admin/attempts/pending 列表项 */
export interface PendingAttempt {
  attempt_id: number
  photo_id: number
  photo_title: string
  user: UserBrief
  image_url: string
  guessed_location: string
  submitted_at: string
}

/** PUT /api/admin/attempts/:id/review 响应 */
export interface ReviewAttemptResponse {
  attempt_id: number
  status: AttemptStatus
  is_winner: boolean
  photo_solved: boolean
  message: string
}

/** PUT /api/admin/prizes/:id/claim 响应 */
export interface ClaimPrizeResponse {
  prize_id: number
  status: string
}

// ============================================================
// 奖品相关 (对应 model.Prize)
// ============================================================

export type PrizeStatus = 'unclaimed' | 'claimed'

export interface PrizeItem {
  id: number
  photo_id: number
  photo_title: string
  status: PrizeStatus
  prize_type: string
  awarded_at: string
}

/** GET /api/users/me/prizes 响应 data */
export interface MyPrizesData {
  prizes: PrizeItem[]
}

// ============================================================
// 故事相关 (对应 model.Story)
// ============================================================

/** GET /api/photos/:id/stories 列表项 */
export interface StoryItem {
  id: number
  user_name: string
  content: string
  media_url: string | null
  likes: number
  created_at: string
}

/** GET /api/photos/:id/stories 响应 data */
export interface StoriesData {
  stories: StoryItem[]
}

/** POST /api/photos/:id/stories 请求体 */
export interface CreateStoryForm {
  content: string
  media_url?: string
}

/** POST /api/photos/:id/stories 响应 (model.Story 的 JSON) */
export interface StoryCreated {
  id: number
  photo_id: number
  user_id: number
  content: string
  media_url: string
  likes: number
  user?: User
}

/** POST /api/stories/media 响应 */
export interface StoryMediaResponse {
  media_url: string
}

import axios, { AxiosError } from 'axios'
import type { ApiResponse } from '../types'

const client = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

/** 后端可能返回的业务错误格式 */
export interface ApiError {
  success: boolean
  message?: string
  code?: number
  error?: string
}

/** 从 axios 错误中提取后端返回的 ApiResponse 级别信息 */
export function extractApiError(err: unknown): ApiError {
  if (err instanceof AxiosError && err.response?.data) {
    const data = err.response.data as Record<string, unknown>
    return {
      success: false,
      message: (data.message as string) || (data.error as string) || err.message,
      code: data.code as number | undefined,
    }
  }
  if (err instanceof Error) {
    return { success: false, message: err.message }
  }
  return { success: false, message: '未知错误' }
}

// 响应拦截器：统一处理 401
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
        // 未登录，跳转到登录页
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
      // 后端自定义错误格式优先
      if (data && typeof data === 'object' && 'message' in data) {
        return Promise.reject(data)
      }
      return Promise.reject(error)
    }
    return Promise.reject(error)
  },
)

export default client

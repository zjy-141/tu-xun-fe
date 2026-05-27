import axios, { AxiosError } from 'axios'

const client = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface ApiError {
  success: boolean
  message?: string
  code?: number
  error?: string
}

export function extractApiError(err: unknown): ApiError {
  if (err && typeof err === 'object' && 'message' in err) {
    const data = err as Record<string, unknown>
    return {
      success: false,
      message: (data.message as string) || (data.error as string) || '请求失败',
      code: data.code as number | undefined,
    }
  }
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

client.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

client.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'resp' in response.data && !('data' in response.data)) {
      response.data.data = response.data.resp
      delete response.data.resp
    }
    if (response.data && typeof response.data === 'object' && response.data.success === false) {
      const errMsg = response.data.message || '操作失败'
      return Promise.reject({ success: false, message: errMsg, code: response.data.code })
    }
    return response
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response
      const url = error.config?.url || ''
      if (status === 401 && !url.includes('/auth/')) {
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login'
        }
      }
      if (data && typeof data === 'object' && 'message' in (data as Record<string, unknown>)) {
        return Promise.reject(data)
      }
      return Promise.reject(error)
    }
    return Promise.reject(error)
  },
)

export default client
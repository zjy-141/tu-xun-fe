import { ref, computed } from 'vue'
import { authApi } from '../api/auth'
import type { User, LoginParams, RegisterParams } from '../types'

const user = ref<User | null>(null)
const loading = ref(true)

export function useAuth() {
  const isAdmin = computed(() => user.value !== null && user.value.level >= 1)

  /** 从服务端刷新当前用户状态 */
  async function refreshUser() {
    try {
      const res = await authApi.me()
      if (res.data.success) user.value = res.data.data
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  /** 登录 */
  async function login(data: LoginParams) {
    const res = await authApi.login(data)
    if (res.data.success) user.value = res.data.data
    return res.data
  }

  /** 注册 */
  async function register(data: RegisterParams) {
    const res = await authApi.register(data)
    if (res.data.success) user.value = res.data.data
    return res.data
  }

  /** 登出 */
  async function logout() {
    await authApi.logout()
    user.value = null
  }

  // 初始化加载用户
  refreshUser()

  return { user, loading, isAdmin, login, register, logout, refreshUser }
}

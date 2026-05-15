import { ref, computed } from 'vue'
import { authApi } from '../api/auth'
import type { User, LoginForm, RegisterForm } from '../types'

const user = ref<User | null>(null)
const loading = ref(true)

export function useAuth() {
  const isAdmin = computed(() => user.value !== null && user.value.level >= 1)

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

  async function login(data: LoginForm) {
    const res = await authApi.login(data)
    if (res.data.success) user.value = res.data.data
  }

  async function register(data: RegisterForm) {
    const res = await authApi.register(data)
    if (res.data.success) user.value = res.data.data
  }

  async function logout() {
    await authApi.logout()
    user.value = null
  }

  // 初始化加载用户
  refreshUser()

  return { user, loading, isAdmin, login, register, logout, refreshUser }
}

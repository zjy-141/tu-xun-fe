import { ref, computed } from 'vue'
import { authApi } from '../api/auth'
import type { User, LoginParams, RegisterParams } from '../types'

const user = ref<User | null>(null)
const loading = ref(true)
let initialized = false

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

  async function login(data: LoginParams) {
    const res = await authApi.login(data)
    if (res.data.success) user.value = res.data.data
    return res.data
  }

  async function register(data: RegisterParams) {
    const res = await authApi.register(data)
    if (res.data.success) user.value = res.data.data
    return res.data
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch { /* ignore */ }
    user.value = null
  }

  if (!initialized) {
    initialized = true
    refreshUser()
  }

  return { user, loading, isAdmin, login, register, logout, refreshUser }
}
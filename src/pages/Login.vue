<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { showToast } from '../composables/toast'
import { extractApiError } from '../api/client'

const { login } = useAuth()
const router = useRouter()

const form = ref({ student_id: '', password: '' })
const submitting = ref(false)

/** 表单校验：返回 null 表示通过，否则返回错误信息 */
function validate(): string | null {
  if (!form.value.student_id.trim()) {
    return '学号不能为空'
  }
  if (!form.value.password) {
    return '密码不能为空'
  }
  return null
}

async function handleSubmit(): Promise<void> {
  const errMsg = validate()
  if (errMsg) {
    showToast('error', errMsg)
    return
  }

  submitting.value = true
  try {
    const res = await login(form.value)
    if (res.success) {
      // Session 认证模式：将用户信息暂存 localStorage（仅 UI 展示用，非安全凭证）
      localStorage.setItem('user', JSON.stringify(res.data))
      showToast('success', '登录成功，欢迎回来！')
      router.push('/')
    }
  } catch (err: unknown) {
    const apiErr = extractApiError(err)
    showToast('error', apiErr.message || '服务器异常，请稍后重试')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-10">
    <h1 class="text-2xl font-bold text-center mb-8">登录</h1>
    <form
      @submit.prevent="handleSubmit"
      class="bg-card rounded-xl p-6 border border-border space-y-4"
      novalidate
    >
      <div>
        <label class="block text-sm font-medium text-text mb-1" for="student-id">学号</label>
        <input
          id="student-id"
          v-model="form.student_id"
          type="text"
          autocomplete="username"
          class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          placeholder="请输入学号"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-text mb-1" for="password">密码</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          placeholder="请输入密码"
        />
      </div>
      <button
        type="submit"
        :disabled="submitting"
        class="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 transition-colors"
      >
        {{ submitting ? '登录中...' : '登录' }}
      </button>
      <p class="text-center text-sm text-text-light">
        还没有账号？
        <router-link to="/register" class="text-primary font-medium hover:underline">
          立即注册
        </router-link>
      </p>
    </form>
  </div>
</template>

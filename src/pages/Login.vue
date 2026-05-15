<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { login } = useAuth()
const router = useRouter()

const form = ref({ student_id: '', password: '' })
const error = ref('')
const submitting = ref(false)

async function handleSubmit() {
  error.value = ''
  if (!form.value.student_id || !form.value.password) {
    error.value = '学号或密码不能为空'
    return
  }
  submitting.value = true
  try {
    await login(form.value)
    router.push('/')
  } catch (err: unknown) {
    error.value = (err as { message?: string })?.message || '登录失败，请检查学号和密码'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-10">
    <h1 class="text-2xl font-bold text-center mb-8">登录</h1>
    <form @submit.prevent="handleSubmit" class="bg-card rounded-xl p-6 border border-border space-y-4">
      <div v-if="error" class="bg-red-50 text-accent text-sm p-3 rounded-lg">{{ error }}</div>
      <div>
        <label class="block text-sm font-medium text-text mb-1">学号</label>
        <input
          v-model="form.student_id"
          type="text"
          class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          placeholder="请输入学号"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-text mb-1">密码</label>
        <input
          v-model="form.password"
          type="password"
          class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          placeholder="请输入密码"
        />
      </div>
      <button
        type="submit"
        :disabled="submitting"
        class="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 transition-colors"
      >{{ submitting ? '登录中...' : '登录' }}</button>
      <p class="text-center text-sm text-text-light">
        还没有账号？<router-link to="/register" class="text-primary font-medium hover:underline">立即注册</router-link>
      </p>
    </form>
  </div>
</template>

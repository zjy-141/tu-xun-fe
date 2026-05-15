<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { register } = useAuth()
const router = useRouter()

const form = ref({ student_id: '', name: '', password: '', email: '' })
const error = ref('')
const submitting = ref(false)

async function handleSubmit() {
  error.value = ''
  if (!form.value.student_id || !form.value.name || !form.value.password || !form.value.email) {
    error.value = '请填写所有必填字段'
    return
  }
  if (form.value.password.length < 6 || form.value.password.length > 20) {
    error.value = '密码长度需在 6-20 位之间'
    return
  }
  submitting.value = true
  try {
    await register(form.value)
    router.push('/')
  } catch (err: unknown) {
    error.value = (err as { message?: string })?.message || '注册失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-10">
    <h1 class="text-2xl font-bold text-center mb-8">注册</h1>
    <form @submit.prevent="handleSubmit" class="bg-card rounded-xl p-6 border border-border space-y-4">
      <div v-if="error" class="bg-red-50 text-accent text-sm p-3 rounded-lg">{{ error }}</div>
      <div>
        <label class="block text-sm font-medium text-text mb-1">学号</label>
        <input v-model="form.student_id" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="请输入学号" />
      </div>
      <div>
        <label class="block text-sm font-medium text-text mb-1">昵称</label>
        <input v-model="form.name" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="给自己取个名字" />
      </div>
      <div>
        <label class="block text-sm font-medium text-text mb-1">校园邮箱</label>
        <input v-model="form.email" type="email" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="example@stu.xjtu.edu.cn" />
      </div>
      <div>
        <label class="block text-sm font-medium text-text mb-1">密码</label>
        <input v-model="form.password" type="password" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="6-20 位密码" />
      </div>
      <button type="submit" :disabled="submitting" class="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 transition-colors">
        {{ submitting ? '注册中...' : '注册' }}
      </button>
      <p class="text-center text-sm text-text-light">
        已有账号？<router-link to="/login" class="text-primary font-medium hover:underline">立即登录</router-link>
      </p>
    </form>
  </div>
</template>

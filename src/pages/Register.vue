<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { showToast } from '../composables/toast'
import { extractApiError } from '../api/client'

const { register } = useAuth()
const router = useRouter()

const form = ref({ student_id: '', name: '', password: '', phone: '', email: '', qq: '', weixin: '', gender: 'secret' })
const submitting = ref(false)

async function handleSubmit() {
  if (!form.value.student_id || !form.value.name || !form.value.password || !form.value.phone || !form.value.gender) {
    showToast('error', '请填写所有必填字段')
    return
  }
  if (form.value.password.length < 6 || form.value.password.length > 20) {
    showToast('error', '密码长度需在 6-20 位之间')
    return
  }
  if (!/^[a-zA-Z0-9]+$/.test(form.value.password)) {
    showToast('error', '密码只能包含字母和数字')
    return
  }
  submitting.value = true
  try {
    await register(form.value)
    showToast('success', '注册成功，欢迎加入！')
    setTimeout(() => router.push('/'), 800)
  } catch (err: unknown) {
    const apiErr = extractApiError(err)
    showToast('error', apiErr.message || '注册失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-10">
    <h1 class="text-2xl font-bold text-center mb-8">注册</h1>
    <form @submit.prevent="handleSubmit" class="bg-card rounded-xl p-6 border border-border space-y-4">
      <div>
        <label class="block text-sm font-medium text-text mb-1">学号</label>
        <input v-model="form.student_id" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="请输入学号" />
      </div>
      <div>
        <label class="block text-sm font-medium text-text mb-1">昵称</label>
        <input v-model="form.name" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="给自己取个名字" />
      </div>
      <div>
        <label class="block text-sm font-medium text-text mb-1">性别 <span class="text-accent">*</span></label>
        <div class="flex gap-3">
          <label v-for="opt in [{v:'male',l:'男'},{v:'female',l:'女'},{v:'other',l:'其他'},{v:'secret',l:'保密'}]" :key="opt.v" class="flex items-center gap-1.5 cursor-pointer">
            <input v-model="form.gender" type="radio" :value="opt.v" class="text-primary focus:ring-primary/20" />
            <span class="text-sm text-text">{{ opt.l }}</span>
          </label>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-text mb-1">手机号 <span class="text-accent">*</span></label>
        <input v-model="form.phone" type="tel" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="请输入手机号" />
      </div>
      <div>
        <label class="block text-sm font-medium text-text mb-1">校园邮箱</label>
        <input v-model="form.email" type="email" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="example@stu.xjtu.edu.cn" />
      </div>
      <div>
        <label class="block text-sm font-medium text-text mb-1">QQ</label>
        <input v-model="form.qq" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="选填" />
      </div>
      <div>
        <label class="block text-sm font-medium text-text mb-1">微信</label>
        <input v-model="form.weixin" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="选填" />
      </div>
      <div>
        <label class="block text-sm font-medium text-text mb-1">密码</label>
        <input v-model="form.password" type="password" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="6-20 位，仅限字母和数字" />
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

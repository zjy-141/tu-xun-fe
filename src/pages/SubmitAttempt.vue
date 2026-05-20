<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { attemptsApi } from '../api/attempts'
import { extractApiError } from '../api/client'
import ImageUpload from '../components/ImageUpload.vue'

const route = useRoute()
const router = useRouter()
const photoId = Number(route.params.id)

const imageFile = ref<File | null>(null)
const guessedLocation = ref('')
const error = ref('')
const submitting = ref(false)

async function handleSubmit() {
  error.value = ''
  if (!imageFile.value) { error.value = '请上传匹配照片'; return }
  if (!guessedLocation.value.trim()) { error.value = '请描述你猜测的地点'; return }
  submitting.value = true
  try {
    const res = await attemptsApi.submit(photoId, {
      image: imageFile.value,
      guessed_location: guessedLocation.value.trim(),
    })
    if (res.data.success) {
      alert(res.data.data.message)
      router.push(`/photos/${photoId}`)
    }
  } catch (err: unknown) {
    const apiErr = extractApiError(err)
    error.value = apiErr.message || '提交失败'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto">
    <h1 class="text-2xl font-bold text-text mb-2">提交答案</h1>
    <p class="text-sm text-text-light mb-6">请在上传图片的<strong>同一地点、同一角度</strong>拍摄照片作为验证</p>

    <form @submit.prevent="handleSubmit" class="bg-card rounded-xl p-6 border border-border space-y-5">
      <div v-if="error" class="bg-red-50 text-accent text-sm p-3 rounded-lg">{{ error }}</div>

      <ImageUpload @select="(f: File) => imageFile = f" label="上传匹配照片" hint="请在同一地点同一角度拍摄" />

      <div>
        <label class="block text-sm font-medium text-text mb-1">猜测的地点 <span class="text-accent">*</span></label>
        <input v-model="guessedLocation" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="如：主楼A座5楼东侧窗台" />
      </div>

      <button type="submit" :disabled="submitting" class="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 transition-colors">
        {{ submitting ? '提交中...' : '提交答案' }}
      </button>
    </form>
  </div>
</template>

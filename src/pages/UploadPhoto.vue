<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { photosApi } from '../api/photos'
import { extractApiError } from '../api/client'
import { showToast } from '../composables/toast'
import ImageUpload from '../components/ImageUpload.vue'

const router = useRouter()

const imageFile = ref<File | null>(null)
const title = ref('')
const description = ref('')
const locationSecret = ref('')
const error = ref('')
const submitting = ref(false)

async function handleSubmit() {
  error.value = ''
  if (!imageFile.value) { error.value = '请上传图片'; return }
  if (!title.value.trim()) { error.value = '请输入图片标题'; return }
  if (!locationSecret.value.trim()) { error.value = '请输入具体地点'; return }
  submitting.value = true
  try {
    const res = await photosApi.upload({
      image: imageFile.value,
      title: title.value.trim(),
      description: description.value.trim() || undefined,
      location_secret: locationSecret.value.trim(),
    })
    if (res.data.success) {
      const d = res.data.data as unknown as { id: number; message: string }
      showToast('success', d.message || '投稿已提交，等待审核')
      setTimeout(() => router.replace(`/photos/${d.id}`), 800)
    } else {
      error.value = '上传失败，请重试'
    }
  } catch (err: unknown) {
    const apiErr = extractApiError(err)
    error.value = apiErr.message || '上传失败'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto">
    <h1 class="text-2xl font-bold text-text mb-6">投稿新机位</h1>
    <form @submit.prevent="handleSubmit" class="bg-card rounded-xl p-6 border border-border space-y-5">
      <div v-if="error" class="bg-red-50 text-accent text-sm p-3 rounded-lg">{{ error }}</div>

      <ImageUpload @select="(f: File) => imageFile = f" label="上传机位照片" hint="支持 JPG/PNG，最大 20MB，建议长边 ≥ 1920px" />

      <div>
        <label class="block text-sm font-medium text-text mb-1">图片标题 <span class="text-accent">*</span></label>
        <input v-model="title" type="text" maxlength="50" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="如：晨光中的钱学森图书馆" />
        <p class="text-xs text-text-light mt-1">{{ title.length }}/50</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-text mb-1">图片描述 / 背后的故事</label>
        <textarea v-model="description" rows="3" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none" placeholder="描述一下这张照片的故事..." />
      </div>

      <div>
        <label class="block text-sm font-medium text-text mb-1">具体地点 <span class="text-accent">*</span></label>
        <input v-model="locationSecret" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="如：主楼A座5楼东侧窗台" />
        <p class="text-xs text-text-light mt-1">此信息仅管理员可见，用于审核答题</p>
      </div>

      <button type="submit" :disabled="submitting" class="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 transition-colors">
        {{ submitting ? '提交中...' : '提交投稿' }}
      </button>
    </form>
  </div>
</template>
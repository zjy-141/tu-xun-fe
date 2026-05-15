<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '../../api/admin'
import Loading from '../../components/Loading.vue'
import Empty from '../../components/Empty.vue'
import Pagination from '../../components/Pagination.vue'
import type { PendingPhoto, ReviewAction } from '../../types'

const photos = ref<PendingPhoto[]>([])
const total = ref(0)
const page = ref(1)
const loading = ref(true)
const reviewing = ref<number | null>(null)
const rejectId = ref<number | null>(null)
const rejectReason = ref('')

async function fetchPhotos() {
  loading.value = true
  try {
    const res = await adminApi.getPendingPhotos({ page: page.value, limit: 10 })
    if (res.data.success) {
      photos.value = res.data.data.items
      total.value = res.data.data.total
    }
  } catch { /* ignore */ }
  finally { loading.value = false }
}

async function handleReview(photoId: number, action: ReviewAction) {
  reviewing.value = photoId
  try {
    await adminApi.reviewPhoto(photoId, { action, reject_reason: action === 'reject' ? rejectReason.value : undefined })
    photos.value = photos.value.filter(p => p.id !== photoId)
    rejectId.value = null
    rejectReason.value = ''
  } catch { /* ignore */ }
  finally { reviewing.value = null }
}

onMounted(fetchPhotos)
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-text mb-6">审核图片投稿</h1>

    <Loading v-if="loading" />
    <Empty v-else-if="photos.length === 0" icon="✅" title="暂无待审核图片" description="所有投稿已处理完毕" />
    <template v-else>
      <div class="space-y-4">
        <div v-for="photo in photos" :key="photo.id" class="bg-card rounded-xl border border-border p-5">
          <div class="flex-1 min-w-0">
            <router-link :to="`/photos/${photo.id}`" class="font-semibold text-text hover:text-primary transition-colors">{{ photo.title }}</router-link>
            <p class="text-sm text-text-light mt-1">作者：{{ photo.author.name }} · 投稿时间：{{ new Date(photo.created_at).toLocaleString('zh-CN') }}</p>
            <p class="text-sm bg-bg rounded-lg p-2 mt-2 text-text">📍 具体地点：{{ photo.location_secret }}</p>
          </div>

          <div class="flex items-center gap-2 mt-4">
            <button @click="handleReview(photo.id, 'approve')" :disabled="reviewing === photo.id" class="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition-colors">
              {{ reviewing === photo.id ? '处理中...' : '通过' }}
            </button>
            <button @click="rejectId = rejectId === photo.id ? null : photo.id" class="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors">拒绝</button>
          </div>

          <div v-if="rejectId === photo.id" class="mt-3 flex gap-2">
            <input v-model="rejectReason" type="text" placeholder="请输入拒绝原因" class="flex-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300" />
            <button @click="handleReview(photo.id, 'reject')" :disabled="reviewing === photo.id || !rejectReason.trim()" class="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors">确认拒绝</button>
          </div>
        </div>
      </div>
      <Pagination :page="page" :total="total" :limit="10" @change="(p: number) => { page = p; fetchPhotos() }" />
    </template>
  </div>
</template>

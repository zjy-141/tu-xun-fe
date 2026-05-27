<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { adminApi } from '../../api/admin'
import { extractApiError } from '../../api/client'
import { formatDateTime } from '../../utils/format'
import { useAuth } from '../../composables/useAuth'
import AdminNav from '../../components/AdminNav.vue'
import Loading from '../../components/Loading.vue'
import Empty from '../../components/Empty.vue'
import Pagination from '../../components/Pagination.vue'

interface RawPendingPhoto {
  id: number
  title: string
  description: string
  location_secret: string
  thumb_url: string
  image_url?: string
  author?: { id: number; name: string; avatar_url: string }
  user_id?: number
  created_at?: string
  status?: string
}

interface DisplayPhoto {
  id: number
  title: string
  description: string
  location_secret: string
  thumb_url: string
  authorName: string
  createdAt: string
}

const { user } = useAuth()
const isSuperAdmin = computed(() => (user.value?.level ?? 0) >= 2)

const photos = ref<DisplayPhoto[]>([])
const total = ref(0)
const page = ref(1)
const loading = ref(true)
const reviewing = ref<number | null>(null)
const rejectId = ref<number | null>(null)
const rejectReason = ref('')
const statusFilter = ref('pending')

async function fetchPhotos() {
  loading.value = true
  try {
    const res = await adminApi.getPendingPhotos({ page: page.value, limit: 10, status: statusFilter.value })
    if (res.data.success) {
      const raw = res.data.data as unknown as { total: number; photos: RawPendingPhoto[] }
      total.value = raw.total
      photos.value = (raw.photos || []).map(p => ({
        id: p.id,
        title: p.title,
        description: p.description || '',
        location_secret: p.location_secret,
        thumb_url: p.thumb_url || p.image_url || '',
        authorName: p.author?.name || '未知用户',
        createdAt: p.created_at || '',
      }))
    }
  } catch { /* ignore */ }
  finally { loading.value = false }
}

async function handleReview(photoId: number, action: 'approve' | 'reject') {
  reviewing.value = photoId
  try {
    await adminApi.reviewPhoto(photoId, {
      action,
      reject_reason: action === 'reject' ? rejectReason.value : undefined,
    })
    photos.value = photos.value.filter(p => p.id !== photoId)
    total.value--
    rejectId.value = null
    rejectReason.value = ''
  } catch (err: unknown) {
    const apiErr = extractApiError(err)
    alert(apiErr.message || '操作失败')
  } finally {
    reviewing.value = null
  }
}

onMounted(fetchPhotos)
</script>

<template>
  <div>
    <AdminNav />
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-text">审核图片投稿</h1>
      <select v-if="isSuperAdmin" v-model="statusFilter" @change="fetchPhotos" class="px-3 py-2 rounded-lg border border-border bg-card text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20">
        <option value="pending">待审核</option>
        <option value="approved">已通过</option>
        <option value="rejected">已拒绝</option>
      </select>
    </div>

    <Loading v-if="loading" />
    <Empty v-else-if="photos.length === 0" icon="✅" title="暂无待审核图片" description="所有投稿已处理完毕" />
    <template v-else>
      <div class="space-y-4">
        <div v-for="photo in photos" :key="photo.id" class="bg-card rounded-xl border border-border p-5">
          <div class="flex gap-4">
            <img v-if="photo.thumb_url" :src="photo.thumb_url" :alt="photo.title" class="w-28 h-28 rounded-lg object-cover shrink-0" />
            <div v-else class="w-28 h-28 rounded-lg bg-gray-100 flex items-center justify-center text-text-light text-sm shrink-0">无预览</div>
            <div class="flex-1 min-w-0">
              <router-link :to="`/photos/${photo.id}`" class="font-semibold text-text hover:text-primary transition-colors">{{ photo.title }}</router-link>
              <p v-if="photo.description" class="text-sm text-text-light mt-1">{{ photo.description }}</p>
              <p class="text-sm text-text-light">作者：{{ photo.authorName }}<span v-if="photo.createdAt"> · 投稿时间：{{ formatDateTime(photo.createdAt) }}</span></p>
              <p class="text-sm bg-bg rounded-lg p-2 mt-2 text-text">📍 具体地点：{{ photo.location_secret }}</p>
            </div>
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
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { photosApi } from '../api/photos'
import PhotoCard from '../components/PhotoCard.vue'
import Pagination from '../components/Pagination.vue'
import Loading from '../components/Loading.vue'
import Empty from '../components/Empty.vue'
import type { PhotoListItem } from '../types'

const route = useRoute()
const router = useRouter()

const photos = ref<PhotoListItem[]>([])
const total = ref(0)
const loading = ref(true)

const page = ref(Number(route.query.page) || 1)
const solvedFilter = ref<string>(String(route.query.solved || ''))

async function fetchPhotos() {
  loading.value = true
  try {
    const params: { page: number; limit: number; solved?: boolean } = { page: page.value, limit: 12 }
    if (solvedFilter.value === 'true') params.solved = true
    else if (solvedFilter.value === 'false') params.solved = false
    const res = await photosApi.list(params)
    if (res.data.success) {
      const d = res.data.data as unknown as { total: number; photos: PhotoListItem[] }
      photos.value = d.photos
      total.value = d.total
    }
  } catch { /* ignore */ }
  finally { loading.value = false }
}

watch([page, solvedFilter], () => {
  const q: Record<string, string> = {}
  if (page.value > 1) q.page = String(page.value)
  if (solvedFilter.value) q.solved = solvedFilter.value
  router.replace({ query: q })
  fetchPhotos()
}, { immediate: true })

function onPageChange(p: number) { page.value = p }
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-text">发现机位</h1>
      <select v-model="solvedFilter" class="px-3 py-2 rounded-lg border border-border bg-card text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20">
        <option value="">全部</option>
        <option value="false">未破解</option>
        <option value="true">已破解</option>
      </select>
    </div>

    <Loading v-if="loading" />
    <Empty v-else-if="photos.length === 0" icon="📷" title="暂无图片" description="还没有人投稿图片，快来成为第一个分享者吧！" />
    <template v-else>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <PhotoCard v-for="p in photos" :key="p.id" :photo="p" />
      </div>
      <Pagination :page="page" :total="total" :limit="12" @change="onPageChange" />
    </template>
  </div>
</template>
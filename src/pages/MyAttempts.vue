<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { photosApi } from '../api/photos'
import Loading from '../components/Loading.vue'
import Empty from '../components/Empty.vue'
import type { MyAttemptsData } from '../types'

const route = useRoute()
const photoId = Number(route.params.id)

const data = ref<MyAttemptsData | null>(null)
const loading = ref(true)

function statusLabel(status: string) {
  const map: Record<string, { text: string; color: string }> = {
    pending: { text: '审核中', color: 'bg-yellow-100 text-yellow-700' },
    approved: { text: '已通过', color: 'bg-green-100 text-green-700' },
    rejected: { text: '已拒绝', color: 'bg-red-100 text-red-700' },
  }
  return map[status] || { text: status, color: 'bg-gray-100 text-gray-700' }
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await photosApi.myAttempts(photoId)
    if (res.data.success) data.value = res.data.data
  } catch { /* ignore */ }
  finally { loading.value = false }
})
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-text mb-6">我的答题记录</h1>

    <Loading v-if="loading" />
    <Empty v-else-if="!data || data.my_attempts.length === 0" icon="📝" title="暂无答题记录" description="你还没有提交过答案" />
    <div v-else class="space-y-4">
      <div v-for="attempt in data.my_attempts" :key="attempt.id" class="bg-card rounded-xl border border-border overflow-hidden">
        <div class="flex gap-4 p-4">
          <img :src="attempt.image_url" alt="答题照片" class="w-24 h-24 rounded-lg object-cover shrink-0" />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', statusLabel(attempt.status).color]">{{ statusLabel(attempt.status).text }}</span>
              <span v-if="attempt.is_winner" class="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">🏆 获奖</span>
            </div>
            <p class="text-sm text-text">猜测地点：{{ attempt.guessed_location }}</p>
            <p v-if="attempt.reviewed_at" class="text-xs text-text-light mt-1">审核时间：{{ new Date(attempt.reviewed_at).toLocaleString('zh-CN') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

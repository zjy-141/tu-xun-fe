<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '../../api/admin'
import { extractApiError } from '../../api/client'
import Loading from '../../components/Loading.vue'
import Empty from '../../components/Empty.vue'
import Pagination from '../../components/Pagination.vue'
import type { PendingAttempt, ReviewAction, ReviewAttemptResponse } from '../../types'

const attempts = ref<PendingAttempt[]>([])
const total = ref(0)
const page = ref(1)
const loading = ref(true)
const reviewing = ref<number | null>(null)
const rejectId = ref<number | null>(null)
const rejectReason = ref('')
const result = ref<ReviewAttemptResponse | null>(null)

async function fetchAttempts() {
  loading.value = true
  try {
    const res = await adminApi.getPendingAttempts({ page: page.value, limit: 10 })
    if (res.data.success) {
      attempts.value = res.data.data.items
      total.value = res.data.data.total
    }
  } catch { /* ignore */ }
  finally { loading.value = false }
}

async function handleReview(attemptId: number, action: ReviewAction) {
  reviewing.value = attemptId
  result.value = null
  try {
    const res = await adminApi.reviewAttempt(attemptId, {
      action,
      reject_reason: action === 'reject' ? rejectReason.value : undefined,
    })
    if (res.data.success) {
      result.value = res.data.data
      attempts.value = attempts.value.filter(a => a.attempt_id !== attemptId)
      rejectId.value = null
      rejectReason.value = ''
    }
  } catch (err: unknown) {
    const apiErr = extractApiError(err)
    alert(apiErr.message || '操作失败')
  } finally {
    reviewing.value = null
  }
}

onMounted(fetchAttempts)
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-text mb-6">审核答题记录</h1>

    <div v-if="result" class="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 text-sm">
      <p class="font-medium text-green-800">{{ result.message }}</p>
      <p class="text-green-600 mt-1">{{ result.is_winner ? '🏆 该用户获得奖品！' : '奖品已被他人领走' }}</p>
    </div>

    <Loading v-if="loading" />
    <Empty v-else-if="attempts.length === 0" icon="✅" title="暂无待审核答题" description="所有答题已处理完毕" />
    <template v-else>
      <div class="space-y-4">
        <div v-for="a in attempts" :key="a.attempt_id" class="bg-card rounded-xl border border-border p-5">
          <div class="flex gap-4">
            <img :src="a.image_url" alt="答题照片" class="w-28 h-28 rounded-lg object-cover shrink-0" />
            <div class="flex-1 min-w-0">
              <router-link :to="`/photos/${a.photo_id}`" class="font-semibold text-text hover:text-primary transition-colors">{{ a.photo_title }}</router-link>
              <p class="text-sm text-text-light mt-1">答题者：{{ a.user.name }} · 提交时间：{{ new Date(a.submitted_at).toLocaleString('zh-CN') }}</p>
              <p class="text-sm bg-bg rounded-lg p-2 mt-2 text-text">📍 猜测地点：{{ a.guessed_location }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2 mt-4">
            <button @click="handleReview(a.attempt_id, 'approve')" :disabled="reviewing === a.attempt_id" class="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition-colors">
              {{ reviewing === a.attempt_id ? '处理中...' : '通过' }}
            </button>
            <button @click="rejectId = rejectId === a.attempt_id ? null : a.attempt_id" class="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors">拒绝</button>
          </div>

          <div v-if="rejectId === a.attempt_id" class="mt-3 flex gap-2">
            <input v-model="rejectReason" type="text" placeholder="请输入拒绝原因（如：角度偏差较大）" class="flex-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300" />
            <button @click="handleReview(a.attempt_id, 'reject')" :disabled="reviewing === a.attempt_id || !rejectReason.trim()" class="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors">确认拒绝</button>
          </div>
        </div>
      </div>
      <Pagination :page="page" :total="total" :limit="10" @change="(p: number) => { page = p; fetchAttempts() }" />
    </template>
  </div>
</template>

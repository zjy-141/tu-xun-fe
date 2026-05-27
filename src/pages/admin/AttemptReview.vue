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

const { user } = useAuth()
const isSuperAdmin = computed(() => (user.value?.level ?? 0) >= 2)

interface RawPendingAttempt {
  attempt_id: number
  photo_id: number
  photo_title: string
  image_url: string
  guessed_location: string
  thumb_url: string
  location_secret: string
  submitted_at?: string
  user?: { id: number; name: string; avatar_url: string }
  user_id?: number
  user_name?: string
}

interface DisplayAttempt {
  attempt_id: number
  photo_id: number
  photo_title: string
  image_url: string
  guessed_location: string
  thumb_url: string
  location_secret: string
  userName: string
  submittedAt: string
}

const attempts = ref<DisplayAttempt[]>([])
const total = ref(0)
const page = ref(1)
const loading = ref(true)
const reviewing = ref<number | null>(null)
const rejectId = ref<number | null>(null)
const rejectReason = ref('')
const markSolved = ref(false)
const statusFilter = ref('pending')
const result = ref<{ message: string; is_winner: boolean } | null>(null)

async function fetchAttempts() {
  loading.value = true
  try {
    const res = await adminApi.getPendingAttempts({ page: page.value, limit: 10, status: statusFilter.value })
    if (res.data.success) {
      const d = res.data.data as unknown as { total: number; items: RawPendingAttempt[] }
      total.value = d.total
      attempts.value = (d.items || []).map(a => ({
        attempt_id: a.attempt_id,
        photo_id: a.photo_id,
        photo_title: a.photo_title || '',
        image_url: a.image_url,
        guessed_location: a.guessed_location,
        thumb_url: a.thumb_url || '',
        location_secret: a.location_secret,
        userName: a.user?.name || a.user_name || '未知用户',
        submittedAt: a.submitted_at || '',
      }))
    }
  } catch { /* ignore */ }
  finally { loading.value = false }
}

async function handleReview(attemptId: number, action: 'approve' | 'reject') {
  reviewing.value = attemptId
  result.value = null
  try {
    const res = await adminApi.reviewAttempt(attemptId, {
      action,
      reject_reason: action === 'reject' ? rejectReason.value : undefined,
      solved: action === 'approve' && isSuperAdmin.value && markSolved.value ? 'solved' : undefined,
    })
    if (res.data.success) {
      const r = res.data.data as unknown as { message: string; is_winner: boolean }
      result.value = r
      attempts.value = attempts.value.filter(a => a.attempt_id !== attemptId)
      total.value--
      rejectId.value = null
      rejectReason.value = ''
      markSolved.value = false
    }
  } catch (err: unknown) {
    const apiErr = extractApiError(err)
    alert(apiErr.message || '操作失败')
  } finally {
    reviewing.value = null
  }
}

function startReview(attemptId: number) {
  rejectId.value = attemptId
  markSolved.value = false
}

onMounted(fetchAttempts)
</script>

<template>
  <div>
    <AdminNav />
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-text">审核答题记录</h1>
      <select v-if="isSuperAdmin" v-model="statusFilter" @change="fetchAttempts" class="px-3 py-2 rounded-lg border border-border bg-card text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20">
        <option value="pending">待审核</option>
        <option value="approved">已通过</option>
        <option value="rejected">已拒绝</option>
      </select>
    </div>

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
            <img :src="a.image_url" :alt="a.photo_title" class="w-28 h-28 rounded-lg object-cover shrink-0" />
            <div class="flex-1 min-w-0">
              <router-link :to="`/photos/${a.photo_id}`" class="font-semibold text-text hover:text-primary transition-colors">{{ a.photo_title }}</router-link>
              <p class="text-sm text-text-light mt-1">答题者：{{ a.userName }}<span v-if="a.submittedAt"> · 提交时间：{{ formatDateTime(a.submittedAt) }}</span></p>
              <p class="text-sm bg-bg rounded-lg p-2 mt-2 text-text">📍 猜测地点：{{ a.guessed_location }}</p>
              <p class="text-sm bg-bg rounded-lg p-2 mt-1 text-text text-text-light">📍 正确地点：{{ a.location_secret }}</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 mt-4">
            <button @click="handleReview(a.attempt_id, 'approve')" :disabled="reviewing === a.attempt_id" class="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition-colors">
              {{ reviewing === a.attempt_id ? '处理中...' : '通过' }}
            </button>
            <label v-if="isSuperAdmin && reviewing !== a.attempt_id" class="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm cursor-pointer hover:bg-bg transition-colors select-none">
              <input type="checkbox" v-model="markSolved" class="rounded border-border text-primary focus:ring-primary/30" />
              <span class="text-text">标记为答对</span>
              <span class="text-xs text-text-light">(发放奖品)</span>
            </label>
            <button @click="startReview(a.attempt_id)" class="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors">拒绝</button>
          </div>

          <div v-if="rejectId === a.attempt_id" class="mt-3 flex gap-2">
            <input v-model="rejectReason" type="text" placeholder="请输入拒绝原因（如：角度偏差较大）" class="flex-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300" />
            <button @click="handleReview(a.attempt_id, 'reject')" :disabled="reviewing === a.attempt_id || !rejectReason.trim()" class="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors shrink-0">确认拒绝</button>
          </div>
        </div>
      </div>
      <Pagination :page="page" :total="total" :limit="10" @change="(p: number) => { page = p; fetchAttempts() }" />
    </template>
  </div>
</template>
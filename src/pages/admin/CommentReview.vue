<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '../../api/admin'
import { extractApiError } from '../../api/client'
import { formatDateTime } from '../../utils/format'
import AdminNav from '../../components/AdminNav.vue'
import Loading from '../../components/Loading.vue'
import Empty from '../../components/Empty.vue'
import type { PendingCommentItem } from '../../types'

const comments = ref<PendingCommentItem[]>([])
const total = ref(0)
const page = ref(1)
const loading = ref(true)
const reviewing = ref<number | null>(null)
const rejectId = ref<number | null>(null)
const rejectReason = ref('')

async function fetchComments() {
  loading.value = true
  try {
    const res = await adminApi.getPendingComments({ page: page.value, limit: 10 })
    if (res.data.success) {
      const d = res.data.data as unknown as { total: number; items: PendingCommentItem[] }
      comments.value = d.items
      total.value = d.total
    }
  } catch { /* ignore */ }
  finally { loading.value = false }
}

async function handleReview(commentId: number, action: 'approve' | 'reject') {
  reviewing.value = commentId
  try {
    await adminApi.reviewComment(commentId, {
      action,
      reject_reason: action === 'reject' ? rejectReason.value : undefined,
    })
    comments.value = comments.value.filter(c => c.comment_id !== commentId)
    rejectId.value = null
    rejectReason.value = ''
  } catch (err: unknown) {
    const apiErr = extractApiError(err)
    alert(apiErr.message || '操作失败')
  } finally {
    reviewing.value = null
  }
}

onMounted(fetchComments)
</script>

<template>
  <div>
    <AdminNav />
    <h1 class="text-2xl font-bold text-text mb-6">审核评论</h1>

    <Loading v-if="loading" />
    <Empty v-else-if="comments.length === 0" icon="✅" title="暂无待审核评论" description="所有评论已处理完毕" />
    <template v-else>
      <div class="space-y-4">
        <div v-for="comment in comments" :key="comment.comment_id" class="bg-card rounded-xl border border-border p-5">
          <div class="flex-1 min-w-0">
            <router-link :to="`/photos/${comment.photo_id}`" class="font-semibold text-text hover:text-primary transition-colors">{{ comment.photo_title }}</router-link>
            <p class="text-sm text-text-light mt-1">
              评论者：{{ comment.user?.name || '未知' }} · {{ formatDateTime(comment.created_at) }}
            </p>
            <p class="text-sm bg-bg rounded-lg p-2 mt-2 text-text">{{ comment.comment }}</p>
          </div>

          <div class="flex items-center gap-2 mt-4">
            <button @click="handleReview(comment.comment_id, 'approve')" :disabled="reviewing === comment.comment_id" class="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition-colors">
              {{ reviewing === comment.comment_id ? '处理中...' : '通过' }}
            </button>
            <button @click="rejectId = rejectId === comment.comment_id ? null : comment.comment_id" class="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors">拒绝</button>
          </div>

          <div v-if="rejectId === comment.comment_id" class="mt-3 flex gap-2">
            <input v-model="rejectReason" type="text" placeholder="请输入拒绝原因" class="flex-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300" />
            <button @click="handleReview(comment.comment_id, 'reject')" :disabled="reviewing === comment.comment_id || !rejectReason.trim()" class="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors">确认拒绝</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
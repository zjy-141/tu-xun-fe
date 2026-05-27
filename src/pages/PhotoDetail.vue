<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { photosApi } from '../api/photos'
import { attemptsApi } from '../api/attempts'
import { likesApi } from '../api/likes'
import { commentsApi } from '../api/comments'
import { useAuth } from '../composables/useAuth'
import { showToast } from '../composables/toast'
import { extractApiError } from '../api/client'
import { formatDate, formatDateTime } from '../utils/format'
import Loading from '../components/Loading.vue'
import Empty from '../components/Empty.vue'
import Pagination from '../components/Pagination.vue'
import type { PhotoDetail, CommentForm, AttemptForm } from '../types'

const route = useRoute()
const router = useRouter()
const { user } = useAuth()

const photoId = computed(() => Number(route.params.id))
const photo = ref<PhotoDetail | null>(null)
const liked = ref(false)
const likeCount = ref(0)
const loading = ref(true)

const comments = ref<CommentForm[]>([])
const commentsTotal = ref(0)
const commentPage = ref(1)
const commentText = ref('')
const commentSubmitting = ref(false)
const commentLoading = ref(false)

const attempts = ref<AttemptForm[]>([])
const attemptsTotal = ref(0)
const attemptPage = ref(1)
const attemptLoading = ref(false)

const commentLikeMap = ref<Record<number, { liked: boolean; count: number }>>({})
const attemptLikeMap = ref<Record<number, { liked: boolean; count: number }>>({})

async function fetchDetail() {
  loading.value = true
  try {
    const res = await photosApi.detail(photoId.value)
    if (res.data.success) photo.value = res.data.data
  } catch { /* ignore */ }
  finally { loading.value = false }
}

async function fetchLikeStatus() {
  if (!user.value) return
  try {
    const res = await likesApi.getPhotoLikeStatus(photoId.value)
    if (res.data.success) {
      liked.value = res.data.data.liked
      likeCount.value = res.data.data.count
    }
  } catch { /* ignore */ }
}

async function toggleLike() {
  if (!user.value) { router.push('/login'); return }
  try {
    const res = await likesApi.togglePhotoLike(photoId.value)
    if (res.data.success) {
      liked.value = res.data.data.liked
      likeCount.value = res.data.data.count
    }
  } catch (err: unknown) {
    const apiErr = extractApiError(err)
    showToast('error', apiErr.message || '操作失败')
  }
}

async function fetchComments() {
  commentLoading.value = true
  try {
    const res = await photosApi.comments(photoId.value, { page: commentPage.value, limit: 10 })
    if (res.data.success) {
      const d = res.data.data as unknown as { total: number; comments: CommentForm[] }
      comments.value = d.comments
      commentsTotal.value = d.total
    }
  } catch { /* ignore */ }
  finally { commentLoading.value = false }
}

async function submitComment() {
  if (!user.value) { router.push('/login'); return }
  if (!commentText.value.trim()) return
  commentSubmitting.value = true
  try {
    await commentsApi.create(photoId.value, { comment_text: commentText.value.trim() })
    commentText.value = ''
    showToast('success', '评论已提交，等待审核')
    fetchComments()
  } catch (err: unknown) {
    const apiErr = extractApiError(err)
    showToast('error', apiErr.message || '评论失败')
  } finally {
    commentSubmitting.value = false
  }
}

async function fetchAttempts() {
  attemptLoading.value = true
  try {
    const res = await photosApi.attempts(photoId.value, { page: attemptPage.value, limit: 10 })
    if (res.data.success) {
      const d = res.data.data as unknown as { total: number; attempts: AttemptForm[] }
      attempts.value = d.attempts
      attemptsTotal.value = d.total
    }
  } catch { /* ignore */ }
  finally { attemptLoading.value = false }
}

function getCommentLike(id: number) {
  const entry = commentLikeMap.value[id]
  return entry || { liked: false, count: 0 }
}

function getAttemptLike(id: number) {
  const entry = attemptLikeMap.value[id]
  return entry || { liked: false, count: 0 }
}

async function toggleCommentLike(commentId: number) {
  if (!user.value) { router.push('/login'); return }
  try {
    const res = await likesApi.toggleCommentLike(commentId)
    if (res.data.success) {
      commentLikeMap.value = { ...commentLikeMap.value, [commentId]: { liked: res.data.data.liked, count: res.data.data.count } }
    }
  } catch { /* ignore */ }
}

async function toggleAttemptLike(attemptId: number) {
  if (!user.value) { router.push('/login'); return }
  try {
    const res = await likesApi.toggleAttemptLike(attemptId)
    if (res.data.success) {
      attemptLikeMap.value = { ...attemptLikeMap.value, [attemptId]: { liked: res.data.data.liked, count: res.data.data.count } }
    }
  } catch { /* ignore */ }
}

async function init() {
  await fetchDetail()
  fetchLikeStatus()
  fetchComments()
  fetchAttempts()
}

init()
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <Loading v-if="loading" />
    <div v-else-if="!photo" class="text-center py-20 text-text-light">图片不存在</div>

    <template v-else>
      <div class="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
        <div class="aspect-[16/9] sm:aspect-[2/1] bg-gray-100">
          <img :src="photo.image_url" :alt="photo.title" class="w-full h-full object-contain" />
        </div>
        <div class="p-6">
          <div class="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 class="text-xl font-bold text-text">{{ photo.title }}</h1>
              <p class="text-sm text-text-light mt-1">
                作者：<router-link v-if="photo.author" :to="`/users/${photo.author.id}`" class="text-primary hover:underline">{{ photo.author.name }}</router-link><span v-else>未知</span> · 发布于 {{ formatDate(photo.created_at) }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="photo.solved" class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">已破解</span>
              <span v-else class="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">待破解 · {{ photo.attempts_count }} 次尝试</span>
            </div>
          </div>

          <p v-if="photo.description" class="mt-4 text-text leading-relaxed">{{ photo.description }}</p>

          <div v-if="photo.winner" class="mt-4 p-3 bg-primary/5 rounded-lg text-sm">
            🏆 <span class="font-medium">{{ photo.winner.user.name }}</span> 已破解此机位！
          </div>

          <div v-if="photo.current_user_attempt" class="mt-4 p-3 bg-bg rounded-lg text-sm">
            <span v-if="photo.current_user_attempt.status === 'pending'" class="text-accent-light">⏳ 你的答案正在审核中...</span>
            <span v-else-if="photo.current_user_attempt.status === 'approved' && photo.current_user_attempt.is_winner" class="text-green-600">🎉 恭喜！你是第一个破解此机位的人！</span>
            <span v-else-if="photo.current_user_attempt.status === 'approved'" class="text-text-light">✅ 你的答案已被确认，但奖品已被领走</span>
            <span v-else class="text-accent">❌ 你的答案未通过审核</span>
          </div>

          <div class="flex items-center gap-3 mt-6">
            <button @click="toggleLike" :class="['flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors', liked ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-bg border border-border text-text-light hover:text-red-400']">
              {{ liked ? '❤️' : '🤍' }} {{ likeCount }}
            </button>
            <router-link
              v-if="user && !photo.current_user_attempt"
              :to="`/photos/${photo.id}/submit`"
              class="px-5 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-light transition-colors"
            >我要答题</router-link>
            <router-link
              v-if="user && photo.current_user_attempt"
              :to="`/photos/${photo.id}/my-attempts`"
              class="px-5 py-2 rounded-lg border border-border text-text font-medium hover:bg-bg transition-colors"
            >查看答题记录</router-link>
          </div>
        </div>
      </div>

      <!-- 已通过的答题 -->
      <div class="mt-8 bg-card rounded-xl border border-border p-6">
        <h2 class="text-lg font-bold text-text mb-4">📝 答题记录 ({{ attemptsTotal }})</h2>
        <Loading v-if="attemptLoading" text="加载中..." />
        <Empty v-else-if="attempts.length === 0" icon="🔍" title="暂无答题" description="成为第一个答题者吧！" />
        <div v-else class="space-y-4">
          <div v-for="a in attempts" :key="a.id" class="flex gap-4 p-4 bg-bg rounded-lg">
            <img :src="a.image_url" alt="答题照片" class="w-24 h-24 rounded-lg object-cover shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <router-link v-if="a.user" :to="`/users/${a.user.id}`" class="text-sm font-medium text-primary hover:underline">{{ a.user.name }}</router-link><span v-else class="text-sm font-medium text-text">{{ a.user?.name || '未知' }}</span>
                <span class="text-xs text-text-light">{{ formatDate(a.created_at) }}</span>
              </div>
              <p class="text-sm text-text">猜测地点：{{ a.guessed_location }}</p>
              <button @click="toggleAttemptLike(a.id)" class="flex items-center gap-1 text-xs mt-1 transition-colors" :class="getAttemptLike(a.id).liked ? 'text-red-500' : 'text-text-light hover:text-red-400'">
                {{ getAttemptLike(a.id).liked ? '❤️' : '🤍' }} <span>{{ getAttemptLike(a.id).count || a.likes_count }}</span>
              </button>
            </div>
          </div>
          <Pagination v-if="attemptsTotal > 10" :page="attemptPage" :total="attemptsTotal" :limit="10" @change="(p: number) => { attemptPage = p; fetchAttempts() }" />
        </div>
      </div>

      <!-- 评论 -->
      <div class="mt-8 bg-card rounded-xl border border-border p-6">
        <h2 class="text-lg font-bold text-text mb-4">💬 评论 ({{ commentsTotal }})</h2>

        <div v-if="user" class="flex gap-2 mb-6">
          <input
            v-model="commentText"
            type="text"
            placeholder="发表评论..."
            class="flex-1 px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
            @keyup.enter="submitComment"
          />
          <button
            @click="submitComment"
            :disabled="commentSubmitting || !commentText.trim()"
            class="px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 transition-colors shrink-0"
          >{{ commentSubmitting ? '发布中...' : '发布' }}</button>
        </div>
        <p v-else class="text-sm text-text-light mb-6">
          <router-link to="/login" class="text-primary hover:underline">登录</router-link> 后可以发表评论
        </p>

        <Loading v-if="commentLoading" text="加载中..." />
        <Empty v-else-if="comments.length === 0" icon="💬" title="暂无评论" description="来说点什么吧" />
        <div v-else class="space-y-4">
          <div v-for="c in comments" :key="c.id" class="p-4 bg-bg rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <router-link v-if="c.user" :to="`/users/${c.user.id}`" class="flex items-center gap-2 hover:underline">
                <span class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">{{ c.user.name.charAt(0) }}</span>
                <span class="text-sm font-medium text-text">{{ c.user.name }}</span>
              </router-link>
              <span v-else class="text-sm font-medium text-text">{{ c.user?.name || '未知' }}</span>
              <span class="text-xs text-text-light">{{ formatDate(c.created_at) }}</span>
            </div>
            <p class="text-sm text-text leading-relaxed">{{ c.content }}</p>
            <button @click="toggleCommentLike(c.id)" class="flex items-center gap-1 text-xs mt-1 transition-colors" :class="getCommentLike(c.id).liked ? 'text-red-500' : 'text-text-light hover:text-red-400'">
              {{ getCommentLike(c.id).liked ? '❤️' : '🤍' }} <span>{{ getCommentLike(c.id).count || c.likes_count }}</span>
            </button>
          </div>
          <Pagination v-if="commentsTotal > 10" :page="commentPage" :total="commentsTotal" :limit="10" @change="(p: number) => { commentPage = p; fetchComments() }" />
        </div>
      </div>
    </template>
  </div>
</template>
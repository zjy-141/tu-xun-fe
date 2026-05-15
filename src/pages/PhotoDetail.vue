<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { photosApi } from '../api/photos'
import { useAuth } from '../composables/useAuth'
import Loading from '../components/Loading.vue'
import type { PhotoDetail, Story } from '../types'

const route = useRoute()
const { user } = useAuth()

const photoId = computed(() => Number(route.params.id))

const photo = ref<PhotoDetail | null>(null)
const stories = ref<Story[]>([])
const storyText = ref('')
const postingStory = ref(false)
const loading = ref(true)
const storyLoading = ref(false)

async function fetchDetail() {
  loading.value = true
  try {
    const res = await photosApi.detail(photoId.value)
    if (res.data.success) photo.value = res.data.data
  } catch { /* ignore */ }
  finally { loading.value = false }
}

async function fetchStories() {
  storyLoading.value = true
  try {
    const res = await photosApi.getStories(photoId.value)
    if (res.data.success) stories.value = res.data.data.stories
  } catch { /* ignore */ }
  finally { storyLoading.value = false }
}

async function handlePostStory() {
  if (!storyText.value.trim()) return
  postingStory.value = true
  try {
    await photosApi.postStory(photoId.value, { content: storyText.value })
    storyText.value = ''
    const res = await photosApi.getStories(photoId.value)
    if (res.data.success) stories.value = res.data.data.stories
  } catch { /* ignore */ }
  finally { postingStory.value = false }
}

onMounted(() => { fetchDetail(); fetchStories() })
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
                作者：{{ photo.author.name }} · 发布于 {{ new Date(photo.created_at).toLocaleDateString('zh-CN') }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="photo.solved" class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">已破解</span>
              <span v-else class="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">待破解 · {{ photo.attempts_count }} 次尝试</span>
            </div>
          </div>

          <p v-if="photo.description" class="mt-4 text-text leading-relaxed">{{ photo.description }}</p>

          <div v-if="photo.winner" class="mt-4 p-3 bg-primary/5 rounded-lg text-sm">
            🏆 <span class="font-medium">{{ photo.winner.name }}</span> 已破解此机位！
          </div>

          <div v-if="photo.current_user_attempt" class="mt-4 p-3 bg-bg rounded-lg text-sm">
            <span v-if="photo.current_user_attempt.status === 'pending'" class="text-accent-light">⏳ 你的答案正在审核中...</span>
            <span v-else-if="photo.current_user_attempt.status === 'approved' && photo.current_user_attempt.is_winner" class="text-green-600">🎉 恭喜！你是第一个破解此机位的人！</span>
            <span v-else-if="photo.current_user_attempt.status === 'approved'" class="text-text-light">✅ 你的答案已被确认，但奖品已被领走</span>
            <span v-else class="text-accent">❌ 你的答案未通过审核</span>
          </div>

          <div class="flex gap-3 mt-6">
            <router-link
              v-if="user && photo.author.id !== user.id && !photo.current_user_attempt"
              :to="`/photos/${photo.id}/submit`"
              class="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-light transition-colors"
            >我要答题</router-link>
            <router-link
              v-if="user && user.id === photo.author.id"
              :to="`/photos/${photo.id}/my-attempts`"
              class="px-5 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-bg transition-colors"
            >查看答题记录</router-link>
          </div>
        </div>
      </div>

      <!-- 故事区域 -->
      <div class="mt-8 bg-card rounded-xl border border-border p-6">
        <h2 class="text-lg font-bold text-text mb-4">📖 发现故事 ({{ stories.length }})</h2>

        <div v-if="user" class="flex gap-2 mb-6">
          <input
            v-model="storyText"
            type="text"
            placeholder="分享你发现这个角落的故事..."
            class="flex-1 px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
          />
          <button
            @click="handlePostStory"
            :disabled="postingStory || !storyText.trim()"
            class="px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 transition-colors shrink-0"
          >{{ postingStory ? '发布中...' : '发布' }}</button>
        </div>

        <Loading v-if="storyLoading" text="加载故事中..." />
        <p v-else-if="stories.length === 0" class="text-sm text-text-light text-center py-6">还没有故事，来分享第一个吧 ✨</p>
        <div v-else class="space-y-4">
          <div v-for="story in stories" :key="story.id" class="p-4 bg-bg rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <span class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">{{ story.user_name.charAt(0) }}</span>
              <span class="text-sm font-medium text-text">{{ story.user_name }}</span>
              <span class="text-xs text-text-light">{{ new Date(story.created_at).toLocaleDateString('zh-CN') }}</span>
            </div>
            <p class="text-sm text-text leading-relaxed">{{ story.content }}</p>
            <img v-if="story.media_url" :src="story.media_url" alt="故事配图" class="mt-2 rounded-lg max-h-48 object-cover" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

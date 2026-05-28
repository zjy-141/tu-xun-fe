<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { authApi } from '../api/auth'
import { photosApi } from '../api/photos'
import { attemptsApi } from '../api/attempts'
import { formatDate } from '../utils/format'
import Loading from '../components/Loading.vue'
import type { UserProfileResponse, PhotoListItem, AttemptForm } from '../types'

const genderLabel = (g?: string) => {
  const map: Record<string, string> = { male: '男', female: '女', other: '其他', secret: '保密' }
  return map[g || ''] || g || ''
}

const route = useRoute()
const userId = computed(() => Number(route.params.id))

const profile = ref<UserProfileResponse | null>(null)
const photos = ref<PhotoListItem[]>([])
const attempts = ref<AttemptForm[]>([])
const loading = ref(true)

async function fetchAll() {
  loading.value = true
  try {
    const [profileRes, photosRes, attemptsRes] = await Promise.all([
      authApi.getUserProfile(userId.value),
      photosApi.userPhotos(userId.value, { page: 1, limit: 12 }),
      attemptsApi.userAttempts(userId.value, { page: 1, limit: 12 }),
    ])
    if (profileRes.data.success) profile.value = profileRes.data.data
    if (photosRes.data.success) {
      const d = photosRes.data.data as unknown as { total: number; photos: PhotoListItem[] }
      photos.value = d.photos || []
    }
    if (attemptsRes.data.success) {
      const d = attemptsRes.data.data as unknown as { total: number; attempts: AttemptForm[] }
      attempts.value = d.attempts || []
    }
  } catch { /* ignore */ }
  finally { loading.value = false }
}

onMounted(fetchAll)
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <Loading v-if="loading" />
    <div v-else-if="!profile" class="text-center py-20 text-text-light">用户不存在</div>
    <template v-else>
      <div class="bg-card rounded-xl border border-border overflow-hidden mb-6">
        <div class="bg-gradient-to-r from-primary to-primary-light p-8 text-center">
          <div class="w-20 h-20 rounded-full bg-white/20 text-white flex items-center justify-center text-3xl font-bold mx-auto overflow-hidden">
            <img v-if="profile.avatar_url" :src="profile.avatar_url" class="w-20 h-20 object-cover rounded-full" :alt="profile.name" />
            <span v-else>{{ profile.name.charAt(0) }}</span>
          </div>
          <h2 class="text-xl font-bold text-white mt-3">{{ profile.name }}</h2>
          <div class="flex items-center justify-center gap-2 mt-1">
            <span v-if="profile.gender" class="text-white/70 text-sm">{{ genderLabel(profile.gender) }}</span>
            <span v-if="profile.level >= 1" class="inline-block px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium">管理员</span>
          </div>
        </div>

        <div class="grid grid-cols-3 border-t border-border">
          <div class="py-3 text-center">
            <div class="text-lg font-semibold text-text">{{ profile.photo_count }}</div>
            <div class="text-xs text-text-light">投稿</div>
          </div>
          <div class="py-3 text-center">
            <div class="text-lg font-semibold text-text">{{ profile.attempt_count }}</div>
            <div class="text-xs text-text-light">答题</div>
          </div>
          <div class="py-3 text-center">
            <div class="text-lg font-semibold text-text">{{ profile.prize_count }}</div>
            <div class="text-xs text-text-light">奖品</div>
          </div>
        </div>

        <div v-if="profile.description" class="px-6 py-4 border-t border-border">
          <p class="text-sm text-text">{{ profile.description }}</p>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-lg font-bold text-text mb-4">📸 投稿作品 ({{ photos.length }})</h2>
        <div v-if="photos.length === 0" class="text-sm text-text-light text-center py-8">暂无投稿</div>
        <div v-else class="grid sm:grid-cols-2 gap-4">
          <router-link
            v-for="p in photos"
            :key="p.id"
            :to="`/photos/${p.id}`"
            class="block bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div class="aspect-video overflow-hidden bg-gray-100">
              <img :src="p.thumb_url" :alt="p.title" class="w-full h-full object-cover" loading="lazy" />
            </div>
            <div class="p-3">
              <h4 class="font-medium text-text truncate text-sm">{{ p.title }}</h4>
              <div class="flex items-center gap-3 text-xs text-text-light mt-1">
                <span>❤️ {{ p.likes_count }}</span>
                <span>{{ p.attempts_count }} 次尝试</span>
                <span v-if="p.solved" class="text-green-600">已破解</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <div>
        <h2 class="text-lg font-bold text-text mb-4">🔍 答题记录 ({{ attempts.length }})</h2>
        <div v-if="attempts.length === 0" class="text-sm text-text-light text-center py-8">暂无答题</div>
        <div v-else class="space-y-3">
          <div v-for="a in attempts" :key="a.id" class="bg-card rounded-xl border border-border p-4 flex gap-4">
            <img :src="a.image_url" class="w-20 h-20 rounded-lg object-cover shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-text">{{ a.guessed_location }}</p>
              <div class="flex items-center gap-3 mt-1 text-xs text-text-light">
                <span>{{ formatDate(a.created_at) }}</span>
                <span>❤️ {{ a.likes_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
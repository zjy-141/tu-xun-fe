<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { authApi } from '../api/auth'
import { showToast } from '../composables/toast'
import { extractApiError } from '../api/client'
import { formatDate } from '../utils/format'
import type { PhotoListItem, AttemptForm } from '../types'
import { photosApi } from '../api/photos'
import { attemptsApi } from '../api/attempts'
import Pagination from '../components/Pagination.vue'

const { user, refreshUser } = useAuth()

const activeTab = ref<'profile' | 'photos' | 'attempts'>('profile')
const photoPage = ref(1)
const attemptPage = ref(1)
const myPhotos = ref<PhotoListItem[]>([])
const myPhotosTotal = ref(0)
const myAttempts = ref<AttemptForm[]>([])
const myAttemptsTotal = ref(0)
const photoLoading = ref(false)
const attemptLoading = ref(false)

const editMode = ref(false)
const editForm = ref({ name: '', phone: '', email: '', qq: '', weixin: '' })
const saving = ref(false)

const passwordForm = ref({ old_password: '', new_password: '' })
const passwordSaving = ref(false)

const avatarUploading = ref(false)

async function fetchMyPhotos() {
  if (!user.value) return
  photoLoading.value = true
  try {
    const res = await photosApi.userPhotos(user.value.id, { page: photoPage.value, limit: 12 })
    if (res.data.success) {
      const d = res.data.data as unknown as { total: number; photos: PhotoListItem[] }
      myPhotos.value = d.photos
      myPhotosTotal.value = d.total
    }
  } catch { /* ignore */ }
  finally { photoLoading.value = false }
}

async function fetchMyAttempts() {
  if (!user.value) return
  attemptLoading.value = true
  try {
    const res = await attemptsApi.userAttempts(user.value.id, { page: attemptPage.value, limit: 12 })
    if (res.data.success) {
      const d = res.data.data as unknown as { total: number; attempts: AttemptForm[] }
      myAttempts.value = d.attempts
      myAttemptsTotal.value = d.total
    }
  } catch { /* ignore */ }
  finally { attemptLoading.value = false }
}

function startEdit() {
  if (!user.value) return
  editForm.value = {
    name: user.value.name,
    phone: user.value.phone || '',
    email: user.value.email || '',
    qq: user.value.qq || '',
    weixin: user.value.weixin || '',
  }
  editMode.value = true
}

async function saveProfile() {
  saving.value = true
  try {
    await authApi.updateProfile(editForm.value)
    await refreshUser()
    editMode.value = false
    showToast('success', '资料更新成功')
  } catch (err: unknown) {
    const apiErr = extractApiError(err)
    showToast('error', apiErr.message || '更新失败')
  } finally {
    saving.value = false
  }
}

async function changePassword() {
  passwordSaving.value = true
  try {
    await authApi.changePassword(passwordForm.value)
    showToast('success', '密码修改成功')
    passwordForm.value = { old_password: '', new_password: '' }
  } catch (err: unknown) {
    const apiErr = extractApiError(err)
    showToast('error', apiErr.message || '修改失败')
  } finally {
    passwordSaving.value = false
  }
}

async function uploadAvatar(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.[0]) return
  avatarUploading.value = true
  try {
    await authApi.uploadAvatar(input.files[0])
    await refreshUser()
    showToast('success', '头像更新成功')
  } catch (err: unknown) {
    const apiErr = extractApiError(err)
    showToast('error', apiErr.message || '上传失败')
  } finally {
    avatarUploading.value = false
  }
}

function switchTab(tab: 'profile' | 'photos' | 'attempts') {
  activeTab.value = tab
  if (tab === 'photos') fetchMyPhotos()
  if (tab === 'attempts') fetchMyAttempts()
}

onMounted(() => {
  // user is loaded by useAuth
})
</script>

<template>
  <div v-if="user" class="max-w-2xl mx-auto">
    <!-- Header -->
    <div class="bg-card rounded-xl border border-border overflow-hidden mb-6">
      <div class="bg-gradient-to-r from-primary to-primary-light p-8 text-center relative">
        <label class="cursor-pointer inline-block relative group">
          <div class="w-20 h-20 rounded-full bg-white/20 text-white flex items-center justify-center text-3xl font-bold mx-auto group-hover:opacity-80 transition-opacity">
            <img v-if="user.avatar_url" :src="user.avatar_url" class="w-20 h-20 rounded-full object-cover" :alt="user.name" />
            <span v-else>{{ user.name.charAt(0) }}</span>
          </div>
          <div v-if="!avatarUploading" class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="text-white text-xs bg-black/30 px-2 py-1 rounded">换头像</span>
          </div>
          <input type="file" accept="image/*" class="hidden" @change="uploadAvatar" :disabled="avatarUploading" />
        </label>
        <h2 class="text-xl font-bold text-white mt-3">{{ user.name }}</h2>
        <p class="text-white/70 text-sm mt-1">{{ user.student_id }}</p>
        <span v-if="user.level >= 1" class="inline-block mt-2 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium">管理员</span>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 border-t border-border">
        <button @click="switchTab('photos')" :class="['py-3 text-center transition-colors', activeTab === 'photos' ? 'text-primary font-medium bg-primary/5' : 'text-text-light hover:text-text']">
          <div class="text-lg font-semibold">{{ user.photo_count ?? 0 }}</div>
          <div class="text-xs">投稿</div>
        </button>
        <button @click="switchTab('attempts')" :class="['py-3 text-center transition-colors', activeTab === 'attempts' ? 'text-primary font-medium bg-primary/5' : 'text-text-light hover:text-text']">
          <div class="text-lg font-semibold">{{ user.attempt_count ?? 0 }}</div>
          <div class="text-xs">答题</div>
        </button>
        <button @click="switchTab('profile')" :class="['py-3 text-center transition-colors', activeTab === 'profile' ? 'text-primary font-medium bg-primary/5' : 'text-text-light hover:text-text']">
          <div class="text-lg font-semibold">{{ user.prize_count ?? 0 }}</div>
          <div class="text-xs">奖品</div>
        </button>
      </div>
    </div>

    <!-- Tab: Profile -->
    <div v-if="activeTab === 'profile'" class="space-y-6">
      <!-- Edit Profile -->
      <div class="bg-card rounded-xl border border-border p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-text">个人信息</h3>
          <button v-if="!editMode" @click="startEdit" class="text-sm text-primary hover:underline">编辑</button>
        </div>

        <div v-if="editMode" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text mb-1">昵称</label>
            <input v-model="editForm.name" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
          </div>
          <div>
            <label class="block text-sm font-medium text-text mb-1">手机号</label>
            <input v-model="editForm.phone" type="tel" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
          </div>
          <div>
            <label class="block text-sm font-medium text-text mb-1">邮箱</label>
            <input v-model="editForm.email" type="email" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text mb-1">QQ</label>
              <input v-model="editForm.qq" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text mb-1">微信</label>
              <input v-model="editForm.weixin" type="text" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
            </div>
          </div>
          <div class="flex gap-3">
            <button @click="saveProfile" :disabled="saving" class="px-5 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 transition-colors">
              {{ saving ? '保存中...' : '保存' }}
            </button>
            <button @click="editMode = false" class="px-5 py-2 rounded-lg border border-border text-text-light hover:text-text transition-colors">取消</button>
          </div>
        </div>

        <div v-else class="space-y-3 text-sm">
          <div class="flex justify-between"><span class="text-text-light">昵称</span><span class="text-text">{{ user.name }}</span></div>
          <div class="flex justify-between"><span class="text-text-light">学号</span><span class="text-text">{{ user.student_id }}</span></div>
          <div class="flex justify-between"><span class="text-text-light">手机号</span><span class="text-text">{{ user.phone || '未设置' }}</span></div>
          <div class="flex justify-between"><span class="text-text-light">邮箱</span><span class="text-text">{{ user.email || '未设置' }}</span></div>
          <div class="flex justify-between"><span class="text-text-light">QQ</span><span class="text-text">{{ user.qq || '未设置' }}</span></div>
          <div class="flex justify-between"><span class="text-text-light">微信</span><span class="text-text">{{ user.weixin || '未设置' }}</span></div>
        </div>
      </div>

      <!-- Change Password -->
      <div class="bg-card rounded-xl border border-border p-6">
        <h3 class="text-lg font-semibold text-text mb-4">修改密码</h3>
        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text mb-1">当前密码</label>
            <input v-model="passwordForm.old_password" type="password" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-text mb-1">新密码</label>
            <input v-model="passwordForm.new_password" type="password" class="w-full px-3 py-2.5 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="6-20位字母和数字" required />
          </div>
          <button type="submit" :disabled="passwordSaving" class="px-5 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 transition-colors">
            {{ passwordSaving ? '修改中...' : '修改密码' }}
          </button>
        </form>
      </div>

      <!-- Quick links -->
      <div class="space-y-3">
        <router-link to="/prizes" class="flex items-center justify-between bg-card rounded-xl border border-border p-4 hover:bg-bg transition-colors">
          <div class="flex items-center gap-3"><span class="text-xl">🎁</span><span class="text-text font-medium">我的奖品</span></div>
          <span class="text-text-light">›</span>
        </router-link>
        <router-link to="/upload" class="flex items-center justify-between bg-card rounded-xl border border-border p-4 hover:bg-bg transition-colors">
          <div class="flex items-center gap-3"><span class="text-xl">📸</span><span class="text-text font-medium">投稿新机位</span></div>
          <span class="text-text-light">›</span>
        </router-link>
      </div>
    </div>

    <!-- Tab: My Photos -->
    <div v-if="activeTab === 'photos'">
      <div v-if="photoLoading" class="py-8 text-center text-text-light">加载中...</div>
      <div v-else-if="myPhotos.length === 0" class="py-8 text-center text-text-light">暂无投稿</div>
      <div v-else class="grid sm:grid-cols-2 gap-4">
        <router-link v-for="p in myPhotos" :key="p.id" :to="`/photos/${p.id}`" class="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
          <div class="aspect-video overflow-hidden bg-gray-100">
            <img :src="p.thumb_url" :alt="p.title" class="w-full h-full object-cover" />
          </div>
          <div class="p-3">
            <h4 class="font-medium text-text truncate">{{ p.title }}</h4>
            <div class="flex items-center gap-2 text-xs text-text-light mt-1">
              <span>❤️ {{ p.likes_count }}</span>
              <span>{{ p.attempts_count }} 次尝试</span>
            </div>
          </div>
        </router-link>
      </div>
      <Pagination v-if="myPhotosTotal > 12" :page="photoPage" :total="myPhotosTotal" :limit="12" @change="(p: number) => { photoPage = p; fetchMyPhotos() }" />
    </div>

    <!-- Tab: My Attempts -->
    <div v-if="activeTab === 'attempts'">
      <div v-if="attemptLoading" class="py-8 text-center text-text-light">加载中...</div>
      <div v-else-if="myAttempts.length === 0" class="py-8 text-center text-text-light">暂无答题记录</div>
      <div v-else class="space-y-3">
        <div v-for="a in myAttempts" :key="a.id" class="bg-card rounded-xl border border-border p-4 flex gap-4">
          <img :src="a.image_url" alt="答题照片" class="w-20 h-20 rounded-lg object-cover shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm text-text">{{ a.guessed_location }}</p>
            <div class="flex items-center gap-3 mt-1 text-xs text-text-light">
              <span>{{ formatDate(a.created_at) }}</span>
              <span>❤️ {{ a.likes_count }}</span>
            </div>
          </div>
        </div>
      </div>
      <Pagination v-if="myAttemptsTotal > 12" :page="attemptPage" :total="myAttemptsTotal" :limit="12" @change="(p: number) => { attemptPage = p; fetchMyAttempts() }" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { authApi } from '../api/auth'
import { showToast } from '../composables/toast'
import { extractApiError } from '../api/client'
import { formatDate } from '../utils/format'
import type { PhotoListItem, AttemptForm, PrizeItem } from '../types'
import { photosApi } from '../api/photos'
import { attemptsApi } from '../api/attempts'
import { prizesApi } from '../api/prizes'
import Pagination from '../components/Pagination.vue'

const { user, refreshUser } = useAuth()

// --- content tabs ---
const activeTab = ref<'photos' | 'attempts' | 'prizes'>('photos')

// photos
const photoPage = ref(1)
const myPhotos = ref<PhotoListItem[]>([])
const myPhotosTotal = ref(0)
const photoLoading = ref(false)

// attempts
const attemptPage = ref(1)
const myAttempts = ref<AttemptForm[]>([])
const myAttemptsTotal = ref(0)
const attemptLoading = ref(false)

// prizes
const prizePage = ref(1)
const myPrizes = ref<PrizeItem[]>([])
const myPrizesTotal = ref(0)
const prizesLoading = ref(false)

// --- profile edit ---
const editMode = ref(false)
const editForm = ref({ name: '', gender: 'secret', phone: '', email: '', qq: '', weixin: '' })
const saving = ref(false)

const descriptionEdit = ref(false)
const editDescription = ref('')
const descriptionSaving = ref(false)

const passwordForm = ref({ old_password: '', new_password: '' })
const passwordSaving = ref(false)

const avatarUploading = ref(false)

function genderLabel(g?: string) {
  const map: Record<string, string> = { male: '男', female: '女', other: '其他', secret: '保密' }
  return map[g || ''] || g || '未设置'
}

// --- fetch ---
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

async function fetchMyPrizes() {
  prizesLoading.value = true
  try {
    const res = await prizesApi.getMyPrizes({ page: prizePage.value, limit: 12 })
    if (res.data.success) {
      const d = res.data.data
      myPrizes.value = d.prizes
      myPrizesTotal.value = d.total
    }
  } catch { /* ignore */ }
  finally { prizesLoading.value = false }
}

function switchTab(tab: 'photos' | 'attempts' | 'prizes') {
  activeTab.value = tab
  if (tab === 'photos') fetchMyPhotos()
  if (tab === 'attempts') fetchMyAttempts()
  if (tab === 'prizes') fetchMyPrizes()
}

// --- profile actions ---
function startEdit() {
  if (!user.value) return
  editForm.value = {
    name: user.value.name,
    gender: user.value.gender || 'secret',
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

function startEditDescription() {
  editDescription.value = user.value?.description || ''
  descriptionEdit.value = true
}

async function saveDescription() {
  descriptionSaving.value = true
  try {
    await authApi.updateDescription({ description: editDescription.value })
    await refreshUser()
    descriptionEdit.value = false
    showToast('success', '简介更新成功')
  } catch (err: unknown) {
    const apiErr = extractApiError(err)
    showToast('error', apiErr.message || '更新失败')
  } finally {
    descriptionSaving.value = false
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

onMounted(() => {
  fetchMyPhotos()
})
</script>

<template>
  <div v-if="user" class="max-w-5xl mx-auto">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- ======== Left: Content Tabs ======== -->
      <div class="flex-1 min-w-0">
        <!-- Tab buttons -->
        <div class="flex bg-card rounded-xl border border-border p-1 gap-1 mb-4">
          <button
            v-for="tab in [
              { k: 'photos' as const, l: '投稿', n: user.photo_count ?? 0 },
              { k: 'attempts' as const, l: '答题', n: user.attempt_count ?? 0 },
              { k: 'prizes' as const, l: '奖品', n: user.prize_count ?? 0 },
            ]"
            :key="tab.k"
            @click="switchTab(tab.k)"
            :class="[
              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.k ? 'bg-primary text-white' : 'text-text-light hover:text-text hover:bg-bg',
            ]"
          >
            {{ tab.l }} {{ tab.n }}
          </button>
        </div>

        <!-- Tab: Photos -->
        <div v-if="activeTab === 'photos'">
          <div v-if="photoLoading" class="py-12 text-center text-text-light">加载中...</div>
          <div v-else-if="myPhotos.length === 0" class="py-12 text-center text-text-light">
            <p class="text-lg mb-2">📸</p>
            <p>暂无投稿</p>
            <router-link to="/upload" class="inline-block mt-3 px-4 py-1.5 rounded-lg bg-primary text-white text-sm hover:bg-primary-light transition-colors">去投稿</router-link>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <!-- Tab: Attempts -->
        <div v-if="activeTab === 'attempts'">
          <div v-if="attemptLoading" class="py-12 text-center text-text-light">加载中...</div>
          <div v-else-if="myAttempts.length === 0" class="py-12 text-center text-text-light">
            <p class="text-lg mb-2">🔍</p>
            <p>暂无答题记录</p>
            <router-link to="/photos" class="inline-block mt-3 px-4 py-1.5 rounded-lg bg-primary text-white text-sm hover:bg-primary-light transition-colors">去答题</router-link>
          </div>
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

        <!-- Tab: Prizes -->
        <div v-if="activeTab === 'prizes'">
          <div v-if="prizesLoading" class="py-12 text-center text-text-light">加载中...</div>
          <div v-else-if="myPrizes.length === 0" class="py-12 text-center text-text-light">
            <p class="text-lg mb-2">🎁</p>
            <p>暂无奖品</p>
            <p class="text-xs mt-1">答对机位后即可获得纪念奖品</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="p in myPrizes" :key="p.id" class="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              <div class="text-2xl shrink-0">{{ p.status === 'claimed' ? '✅' : '🎁' }}</div>
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-text">{{ p.prize_type }}</h4>
                <p class="text-sm text-text-light">来源：{{ p.photo_title }}</p>
                <p class="text-xs text-text-light mt-0.5">获得时间：{{ formatDate(p.awarded_at) }}</p>
              </div>
              <span :class="['px-2.5 py-1 rounded-full text-xs font-medium shrink-0', p.status === 'claimed' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700']">
                {{ p.status === 'claimed' ? '已领取' : '待领取' }}
              </span>
            </div>
          </div>
          <Pagination v-if="myPrizesTotal > 12" :page="prizePage" :total="myPrizesTotal" :limit="12" @change="(p: number) => { prizePage = p; fetchMyPrizes() }" />
        </div>
      </div>

      <!-- ======== Right: Profile Card ======== -->
      <div class="w-full md:w-80 shrink-0 space-y-4">
        <!-- Avatar & Name -->
        <div class="bg-card rounded-xl border border-border overflow-hidden">
          <div class="bg-gradient-to-r from-primary to-primary-light p-6 text-center relative">
            <label class="cursor-pointer inline-block relative group">
              <div class="w-16 h-16 rounded-full bg-white/20 text-white flex items-center justify-center text-2xl font-bold mx-auto group-hover:opacity-80 transition-opacity">
                <img v-if="user.avatar_url" :src="user.avatar_url" class="w-16 h-16 rounded-full object-cover" :alt="user.name" />
                <span v-else>{{ user.name.charAt(0) }}</span>
              </div>
              <div v-if="!avatarUploading" class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="text-white text-xs bg-black/30 px-2 py-1 rounded">换头像</span>
              </div>
              <input type="file" accept="image/*" class="hidden" @change="uploadAvatar" :disabled="avatarUploading" />
            </label>
            <h2 class="text-lg font-bold text-white mt-2">{{ user.name }}</h2>
            <p class="text-white/70 text-xs">{{ user.student_id }} · {{ genderLabel(user.gender) }}</p>
            <span v-if="user.level >= 1" class="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-white/20 text-white text-xs">管理员</span>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 border-t border-border">
            <button @click="switchTab('photos')" :class="['py-2.5 text-center transition-colors', activeTab === 'photos' ? 'text-primary bg-primary/5' : 'text-text-light hover:text-text']">
              <div class="text-base font-semibold">{{ user.photo_count ?? 0 }}</div>
              <div class="text-xs">投稿</div>
            </button>
            <button @click="switchTab('attempts')" :class="['py-2.5 text-center transition-colors', activeTab === 'attempts' ? 'text-primary bg-primary/5' : 'text-text-light hover:text-text']">
              <div class="text-base font-semibold">{{ user.attempt_count ?? 0 }}</div>
              <div class="text-xs">答题</div>
            </button>
            <button @click="switchTab('prizes')" :class="['py-2.5 text-center transition-colors', activeTab === 'prizes' ? 'text-primary bg-primary/5' : 'text-text-light hover:text-text']">
              <div class="text-base font-semibold">{{ user.prize_count ?? 0 }}</div>
              <div class="text-xs">奖品</div>
            </button>
          </div>
        </div>

        <!-- Personal Info -->
        <div class="bg-card rounded-xl border border-border p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-text">个人信息</h3>
            <button v-if="!editMode" @click="startEdit" class="px-3 py-1 rounded-lg border border-border text-xs text-text-light hover:text-text hover:border-primary/30 transition-colors">编辑</button>
          </div>

          <div v-if="editMode" class="space-y-3">
            <div>
              <label class="block text-xs text-text-light mb-1">昵称</label>
              <input v-model="editForm.name" type="text" class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
            </div>
            <div>
              <label class="block text-xs text-text-light mb-1">性别</label>
              <div class="flex gap-2 flex-wrap">
                <label v-for="opt in [{v:'male',l:'男'},{v:'female',l:'女'},{v:'other',l:'其他'},{v:'secret',l:'保密'}]" :key="opt.v" class="flex items-center gap-1 cursor-pointer">
                  <input v-model="editForm.gender" type="radio" :value="opt.v" class="text-primary focus:ring-primary/20" />
                  <span class="text-xs text-text">{{ opt.l }}</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-xs text-text-light mb-1">手机号</label>
              <input v-model="editForm.phone" type="tel" class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
            </div>
            <div>
              <label class="block text-xs text-text-light mb-1">邮箱</label>
              <input v-model="editForm.email" type="email" class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-text-light mb-1">QQ</label>
                <input v-model="editForm.qq" type="text" class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
              </div>
              <div>
                <label class="block text-xs text-text-light mb-1">微信</label>
                <input v-model="editForm.weixin" type="text" class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="saveProfile" :disabled="saving" class="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 transition-colors">
                {{ saving ? '保存中' : '保存' }}
              </button>
              <button @click="editMode = false" class="px-4 py-1.5 rounded-lg border border-border text-sm text-text-light hover:text-text transition-colors">取消</button>
            </div>
          </div>

          <div v-else class="space-y-2 text-sm">
            <div class="flex justify-between"><span class="text-text-light">昵称</span><span class="text-text">{{ user.name }}</span></div>
            <div class="flex justify-between"><span class="text-text-light">学号</span><span class="text-text">{{ user.student_id }}</span></div>
            <div class="flex justify-between"><span class="text-text-light">手机号</span><span class="text-text">{{ user.phone || '-' }}</span></div>
            <div class="flex justify-between"><span class="text-text-light">邮箱</span><span class="text-text">{{ user.email || '-' }}</span></div>
            <div class="flex justify-between"><span class="text-text-light">QQ</span><span class="text-text">{{ user.qq || '-' }}</span></div>
            <div class="flex justify-between"><span class="text-text-light">微信</span><span class="text-text">{{ user.weixin || '-' }}</span></div>
          </div>
        </div>

        <!-- Description -->
        <div class="bg-card rounded-xl border border-border p-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-text">个人简介</h3>
            <button v-if="!descriptionEdit" @click="startEditDescription" class="px-3 py-1 rounded-lg border border-border text-xs text-text-light hover:text-text hover:border-primary/30 transition-colors">{{ user.description ? '编辑' : '添加' }}</button>
          </div>

          <div v-if="descriptionEdit" class="space-y-2">
            <textarea v-model="editDescription" rows="3" class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none" placeholder="介绍一下自己..."></textarea>
            <div class="flex gap-2">
              <button @click="saveDescription" :disabled="descriptionSaving" class="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 transition-colors">
                {{ descriptionSaving ? '保存中' : '保存' }}
              </button>
              <button @click="descriptionEdit = false" class="px-4 py-1.5 rounded-lg border border-border text-sm text-text-light hover:text-text transition-colors">取消</button>
            </div>
          </div>
          <p v-else-if="user.description" class="text-sm text-text">{{ user.description }}</p>
          <p v-else class="text-sm text-text-light">暂无简介</p>
        </div>

        <!-- Change Password -->
        <div class="bg-card rounded-xl border border-border p-4">
          <h3 class="font-semibold text-text mb-3">修改密码</h3>
          <form @submit.prevent="changePassword" class="space-y-3">
            <div>
              <input v-model="passwordForm.old_password" type="password" placeholder="当前密码" class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" required />
            </div>
            <div>
              <input v-model="passwordForm.new_password" type="password" placeholder="新密码（6-20位字母和数字）" class="w-full px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" required />
            </div>
            <button type="submit" :disabled="passwordSaving" class="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 transition-colors">
              {{ passwordSaving ? '修改中...' : '修改密码' }}
            </button>
          </form>
        </div>

        <!-- Quick Link -->
        <router-link to="/upload" class="flex items-center justify-between bg-card rounded-xl border border-border p-4 hover:bg-bg transition-colors">
          <div class="flex items-center gap-3"><span class="text-lg">📸</span><span class="text-sm text-text font-medium">投稿新机位</span></div>
          <span class="text-text-light text-sm">›</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

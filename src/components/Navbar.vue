<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import { messagesApi } from '../api/messages'

const { user, isAdmin, logout } = useAuth()
const router = useRouter()
const unreadCount = ref(0)
const showDropdown = ref(false)
const showAdmin = ref(false)

async function fetchUnread() {
  if (!user.value) return
  try {
    const res = await messagesApi.unreadCount()
    if (res.data.success) {
      unreadCount.value = (res.data.data as unknown as { count: number }).count
    }
  } catch { /* ignore */ }
}

async function handleLogout() {
  await logout()
  router.push('/')
}

function onClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.user-dropdown')) showDropdown.value = false
  if (!target.closest('.admin-dropdown')) showAdmin.value = false
}

onMounted(() => {
  fetchUnread()
  document.addEventListener('click', onClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
    <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 font-bold text-lg text-primary">
        <span class="text-xl">🔍</span>
        <span class="hidden sm:inline">挑战西交图寻</span>
      </router-link>

      <div class="flex items-center gap-1 text-sm">
        <router-link
          to="/photos"
          class="px-3 py-2 rounded-lg text-text-light hover:text-text hover:bg-bg transition-colors"
        >发现</router-link>

        <template v-if="user">
          <router-link
            to="/upload"
            class="px-3 py-2 rounded-lg text-primary font-medium hover:bg-primary/5 transition-colors"
          >投稿</router-link>

          <div v-if="isAdmin" class="relative admin-dropdown">
            <button @click.stop="showAdmin = !showAdmin" class="px-3 py-2 rounded-lg text-accent-light font-medium hover:bg-accent-light/5 transition-colors">审核 ▾</button>
            <div v-if="showAdmin" class="absolute left-0 top-full mt-1 w-36 bg-card rounded-xl shadow-lg border border-border py-1 z-50">
              <router-link to="/admin/photos" @click="showAdmin = false" class="block px-4 py-2 text-sm text-text hover:bg-bg transition-colors">图片审核</router-link>
              <router-link to="/admin/attempts" @click="showAdmin = false" class="block px-4 py-2 text-sm text-text hover:bg-bg transition-colors">答题审核</router-link>
              <router-link to="/admin/comments" @click="showAdmin = false" class="block px-4 py-2 text-sm text-text hover:bg-bg transition-colors">评论审核</router-link>
              <router-link to="/admin/prizes" @click="showAdmin = false" class="block px-4 py-2 text-sm text-text hover:bg-bg transition-colors">奖品管理</router-link>
            </div>
          </div>

          <router-link to="/messages" class="relative px-3 py-2 rounded-lg text-text-light hover:text-text hover:bg-bg transition-colors">
            <span>消息</span>
            <span v-if="unreadCount > 0" class="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
          </router-link>

          <div class="relative user-dropdown">
            <button @click.stop="showDropdown = !showDropdown" class="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-bg transition-colors">
              <span class="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                <img v-if="user.avatar_url" :src="user.avatar_url" :alt="user.name" class="w-7 h-7 object-cover rounded-full" />
                <span v-else>{{ user.name.charAt(0) }}</span>
              </span>
              <span class="hidden sm:inline text-text">{{ user.name }}</span>
            </button>
            <div v-if="showDropdown" class="absolute right-0 top-full mt-1 w-40 bg-card rounded-xl shadow-lg border border-border py-1 z-50">
              <router-link to="/profile" @click="showDropdown = false" class="block px-4 py-2 text-sm text-text hover:bg-bg transition-colors">个人中心</router-link>
              <router-link to="/prizes" @click="showDropdown = false" class="block px-4 py-2 text-sm text-text hover:bg-bg transition-colors">我的奖品</router-link>
              <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-text-light hover:bg-bg transition-colors">退出登录</button>
            </div>
          </div>
        </template>

        <template v-else>
          <router-link
            to="/login"
            class="px-3 py-2 rounded-lg text-text-light hover:text-text hover:bg-bg transition-colors"
          >登录</router-link>
          <router-link
            to="/register"
            class="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-light transition-colors"
          >注册</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>
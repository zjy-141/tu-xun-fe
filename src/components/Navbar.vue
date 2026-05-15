<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const { user, isAdmin, logout } = useAuth()
const router = useRouter()

async function handleLogout() {
  await logout()
  router.push('/')
}
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

          <router-link
            v-if="isAdmin"
            to="/admin/photos"
            class="px-3 py-2 rounded-lg text-accent-light font-medium hover:bg-accent-light/5 transition-colors"
          >审核</router-link>

          <router-link
            to="/prizes"
            class="px-3 py-2 rounded-lg text-text-light hover:text-text hover:bg-bg transition-colors"
          >奖品</router-link>

          <div class="relative group">
            <button class="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-bg transition-colors">
              <span class="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                {{ user.name.charAt(0) }}
              </span>
              <span class="hidden sm:inline text-text">{{ user.name }}</span>
            </button>
            <div class="absolute right-0 top-full mt-1 w-40 bg-card rounded-xl shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-text hover:bg-bg transition-colors"
              >个人中心</router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-text-light hover:bg-bg transition-colors"
              >退出登录</button>
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

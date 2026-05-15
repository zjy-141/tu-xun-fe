<script setup lang="ts">
import { useAuth } from '../composables/useAuth'

const { user } = useAuth()
</script>

<template>
  <div v-if="user" class="max-w-lg mx-auto">
    <h1 class="text-2xl font-bold text-text mb-6">个人中心</h1>

    <div class="bg-card rounded-xl border border-border overflow-hidden">
      <div class="bg-gradient-to-r from-primary to-primary-light p-8 text-center">
        <div class="w-20 h-20 rounded-full bg-white/20 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-3">
          {{ user.name.charAt(0) }}
        </div>
        <h2 class="text-xl font-bold text-white">{{ user.name }}</h2>
        <p class="text-white/70 text-sm mt-1">{{ user.student_id }}</p>
        <span v-if="user.level >= 1" class="inline-block mt-2 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium">管理员</span>
      </div>

      <div class="divide-y divide-border">
        <router-link to="/prizes" class="flex items-center justify-between px-6 py-4 hover:bg-bg transition-colors">
          <div class="flex items-center gap-3"><span class="text-xl">🎁</span><span class="text-text font-medium">我的奖品</span></div>
          <span class="text-text-light">{{ user.prize_count ?? 0 }} 个 ›</span>
        </router-link>
        <router-link to="/upload" class="flex items-center justify-between px-6 py-4 hover:bg-bg transition-colors">
          <div class="flex items-center gap-3"><span class="text-xl">📸</span><span class="text-text font-medium">投稿新机位</span></div>
          <span class="text-text-light">›</span>
        </router-link>
        <router-link to="/photos" class="flex items-center justify-between px-6 py-4 hover:bg-bg transition-colors">
          <div class="flex items-center gap-3"><span class="text-xl">🔍</span><span class="text-text font-medium">浏览发现</span></div>
          <span class="text-text-light">›</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

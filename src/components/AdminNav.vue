<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { to: '/admin/photos', label: '图片审核' },
  { to: '/admin/attempts', label: '答题审核' },
  { to: '/admin/comments', label: '评论审核' },
  { to: '/admin/prizes', label: '奖品管理' },
]
</script>

<template>
  <div class="flex gap-2 mb-6 border-b border-border">
    <router-link
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      :class="['px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px', route.path === tab.to ? 'border-primary text-primary' : 'border-transparent text-text-light hover:text-text']"
    >{{ tab.label }}</router-link>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  icon?: string
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 text-center">
    <span class="text-5xl mb-4">{{ icon ?? '📭' }}</span>
    <h3 class="text-lg font-medium text-text mb-1">{{ title ?? '暂无内容' }}</h3>
    <p v-if="description" class="text-sm text-text-light max-w-sm">{{ description }}</p>
    <div v-if="$slots.action" class="mt-4"><slot name="action" /></div>
  </div>
</template>

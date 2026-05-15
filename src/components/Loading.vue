<script setup lang="ts">
defineProps<{ text?: string }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    <p class="mt-4 text-text-light text-sm">{{ text ?? '加载中...' }}</p>
  </div>
</template>

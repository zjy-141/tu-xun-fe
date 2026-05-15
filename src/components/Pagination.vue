<script setup lang="ts">
defineProps<{
  page: number
  total: number
  limit: number
}>()

const emit = defineEmits<{
  (e: 'change', page: number): void
}>()
</script>

<template>
  <div v-if="Math.ceil(total / limit) > 1" class="flex items-center justify-center gap-1 mt-8">
    <button
      :disabled="page <= 1"
      class="px-3 py-2 rounded-lg text-sm border border-border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-bg transition-colors"
      @click="emit('change', page - 1)"
    >‹</button>

    <template v-for="p of Math.ceil(total / limit)" :key="p">
      <button
        v-if="p === 1 || p === Math.ceil(total / limit) || Math.abs(p - page) <= 1"
        :class="['px-3 py-2 rounded-lg text-sm font-medium transition-colors', p === page ? 'bg-primary text-white' : 'border border-border hover:bg-bg']"
        @click="emit('change', p)"
      >{{ p }}</button>
      <span
        v-else-if="(p === 2 && page > 3) || (p === Math.ceil(total / limit) - 1 && page < Math.ceil(total / limit) - 2)"
        class="px-2 text-text-light"
      >…</span>
    </template>

    <button
      :disabled="page >= Math.ceil(total / limit)"
      class="px-3 py-2 rounded-lg text-sm border border-border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-bg transition-colors"
      @click="emit('change', page + 1)"
    >›</button>
  </div>
</template>

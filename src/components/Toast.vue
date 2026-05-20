<script setup lang="ts">
import { toasts } from '../composables/toast'
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          :class="[
            'pointer-events-auto px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 min-w-[200px] max-w-sm',
            t.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white',
          ]"
        >
          <span>{{ t.type === 'success' ? '✅' : '❌' }}</span>
          <span>{{ t.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.35s ease-out;
}
.toast-leave-active {
  transition: all 0.25s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-16px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>

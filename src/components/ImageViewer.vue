<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const loaded = ref(false)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.visible) emit('close')
}

function onBackdropClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('viewer-backdrop')) emit('close')
}

watch(() => props.visible, (v) => {
  if (v) {
    loaded.value = false
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="viewer-backdrop fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      @click="onBackdropClick"
    >
      <button
        @click="emit('close')"
        class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-colors"
        title="关闭"
      >&times;</button>

      <div v-if="!loaded" class="text-white/60 text-sm">加载中...</div>

      <img
        :src="src"
        :alt="alt || ''"
        :class="['max-w-full max-h-full object-contain rounded-lg transition-opacity duration-300', loaded ? 'opacity-100' : 'opacity-0 absolute']"
        @load="loaded = true"
        @click.stop
        draggable="false"
      />
    </div>
  </Teleport>
</template>

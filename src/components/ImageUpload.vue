<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  accept?: string
  maxSizeMB?: number
  label?: string
  hint?: string
}>(), {
  accept: 'image/jpeg,image/png',
  maxSizeMB: 20,
  label: '点击或拖拽上传图片',
})

const emit = defineEmits<{
  (e: 'select', file: File): void
}>()

const inputRef = ref<HTMLInputElement>()
const preview = ref<string | null>(null)
const error = ref('')
const dragging = ref(false)

function handleFile(file: File) {
  error.value = ''
  if (!file.type.match(/^image\/(jpeg|png)$/)) {
    error.value = '仅支持 JPG/PNG 格式'
    return
  }
  if (file.size > props.maxSizeMB * 1024 * 1024) {
    error.value = `文件大小不能超过 ${props.maxSizeMB}MB`
    return
  }
  preview.value = URL.createObjectURL(file)
  emit('select', file)
}

function clearPreview() {
  preview.value = null
  if (inputRef.value) inputRef.value.value = ''
}
</script>

<template>
  <div>
    <div
      class="relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors"
      :class="dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-bg'"
      @click="inputRef?.click()"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="dragging = false; const f = $event.dataTransfer?.files?.[0]; if (f) handleFile(f)"
    >
      <div v-if="preview" class="relative">
        <img :src="preview" alt="预览" class="max-h-64 mx-auto rounded-lg object-contain" />
        <button
          type="button"
          class="absolute top-2 right-2 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-black/70"
          @click.stop="clearPreview"
        >✕</button>
      </div>
      <div v-else class="py-8">
        <div class="text-4xl mb-2">📷</div>
        <p class="text-text font-medium">{{ label }}</p>
        <p v-if="hint" class="text-xs text-text-light mt-1">{{ hint }}</p>
      </div>
      <input
        ref="inputRef"
        type="file"
        :accept="accept"
        class="hidden"
        @change="const f = ($event.target as HTMLInputElement).files?.[0]; if (f) handleFile(f)"
      />
    </div>
    <p v-if="error" class="text-accent text-sm mt-1">{{ error }}</p>
  </div>
</template>

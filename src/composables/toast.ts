import { ref } from 'vue'

export interface ToastItem {
  id: number
  type: 'success' | 'error'
  message: string
}

let _id = 0
export const toasts = ref<ToastItem[]>([])

export function showToast(type: 'success' | 'error', message: string, duration = 3000) {
  const id = ++_id
  toasts.value.push({ id, type, message })
  if (duration > 0) {
    setTimeout(() => {
      const idx = toasts.value.findIndex(t => t.id === id)
      if (idx !== -1) toasts.value.splice(idx, 1)
    }, duration)
  }
}

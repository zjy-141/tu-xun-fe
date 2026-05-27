export function formatDate(date: string | number | undefined | null, fallback = ''): string {
  if (!date) return fallback
  const d = new Date(date)
  if (isNaN(d.getTime())) return fallback
  return d.toLocaleDateString('zh-CN')
}

export function formatDateTime(date: string | number | undefined | null, fallback = ''): string {
  if (!date) return fallback
  const d = new Date(date)
  if (isNaN(d.getTime())) return fallback
  return d.toLocaleString('zh-CN')
}

export function formatTime(date: string | number | undefined | null): string {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('zh-CN')
}

export function formatRelativeTime(date: string | number | undefined | null): string {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  return d.toLocaleDateString('zh-CN')
}
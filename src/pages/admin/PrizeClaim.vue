<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { prizesApi } from '../../api/prizes'
import { adminApi } from '../../api/admin'
import { extractApiError } from '../../api/client'
import Loading from '../../components/Loading.vue'
import Empty from '../../components/Empty.vue'
import type { PrizeItem } from '../../types'

const prizes = ref<PrizeItem[]>([])
const loading = ref(true)
const claiming = ref<number | null>(null)

const unclaimed = computed(() => prizes.value.filter(p => p.status === 'unclaimed'))
const claimed = computed(() => prizes.value.filter(p => p.status === 'claimed'))

async function fetchPrizes() {
  loading.value = true
  try {
    const res = await prizesApi.getMyPrizes()
    if (res.data.success) prizes.value = res.data.data.prizes
  } catch { /* ignore */ }
  finally { loading.value = false }
}

async function handleClaim(prizeId: number) {
  claiming.value = prizeId
  try {
    await adminApi.claimPrize(prizeId)
    prizes.value = prizes.value.map(p =>
      p.id === prizeId ? { ...p, status: 'claimed' as const } : p,
    )
  } catch (err: unknown) {
    const apiErr = extractApiError(err)
    alert(apiErr.message || '操作失败')
  } finally {
    claiming.value = null
  }
}

onMounted(fetchPrizes)
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-text mb-6">奖品发放管理</h1>

    <Loading v-if="loading" />
    <Empty v-else-if="prizes.length === 0" icon="🎁" title="暂无奖品记录" />
    <div v-else class="space-y-8">
      <div v-if="unclaimed.length > 0">
        <h2 class="text-lg font-semibold text-text mb-3">⏳ 待领取 ({{ unclaimed.length }})</h2>
        <div class="space-y-3">
          <div v-for="prize in unclaimed" :key="prize.id" class="bg-card rounded-xl border border-border p-4 flex items-center justify-between gap-4">
            <div>
              <p class="font-medium text-text">{{ prize.prize_type }}</p>
              <p class="text-sm text-text-light">来源：{{ prize.photo_title }} · {{ new Date(prize.awarded_at).toLocaleDateString('zh-CN') }}</p>
            </div>
            <button @click="handleClaim(prize.id)" :disabled="claiming === prize.id" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 transition-colors shrink-0">
              {{ claiming === prize.id ? '处理中...' : '标记已领取' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="claimed.length > 0">
        <h2 class="text-lg font-semibold text-text mb-3">✅ 已领取 ({{ claimed.length }})</h2>
        <div class="space-y-3">
          <div v-for="prize in claimed" :key="prize.id" class="bg-card rounded-xl border border-border p-4 opacity-60">
            <p class="font-medium text-text">{{ prize.prize_type }}</p>
            <p class="text-sm text-text-light">来源：{{ prize.photo_title }} · {{ new Date(prize.awarded_at).toLocaleDateString('zh-CN') }}</p>
            <span class="inline-block mt-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">已领取</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

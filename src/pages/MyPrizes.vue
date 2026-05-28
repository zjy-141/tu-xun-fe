<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { prizesApi } from '../api/prizes'
import Loading from '../components/Loading.vue'
import Empty from '../components/Empty.vue'
import { formatDate } from '../utils/format'
import type { PrizeItem } from '../types'

const prizes = ref<PrizeItem[]>([])
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  try {
    const res = await prizesApi.getMyPrizes()
    if (res.data.success) {
      prizes.value = res.data.data.prizes
    }
  } catch { /* ignore */ }
  finally { loading.value = false }
})
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-text mb-6">我的奖品</h1>

    <Loading v-if="loading" />
    <Empty v-else-if="prizes.length === 0" icon="🎁" title="暂无奖品" description="答对机位后即可获得纪念奖品，加油！" />
    <div v-else class="space-y-4">
      <div v-for="prize in prizes" :key="prize.id" class="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
        <div class="text-3xl shrink-0">{{ prize.status === 'claimed' ? '✅' : '🎁' }}</div>
        <div class="flex-1">
          <h3 class="font-semibold text-text">{{ prize.prize_type }}</h3>
          <p class="text-sm text-text-light">来源：{{ prize.photo_title }}</p>
          <p class="text-xs text-text-light mt-1">获得时间：{{ formatDate(prize.awarded_at) }}</p>
        </div>
        <span :class="['px-3 py-1 rounded-full text-xs font-medium shrink-0', prize.status === 'claimed' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700']">
          {{ prize.status === 'claimed' ? '已领取' : '待领取' }}
        </span>
      </div>
      <div class="p-4 bg-primary/5 rounded-xl text-sm text-text-light">
        💡 待领取的奖品请携带校园卡线下领取，具体时间和地点请关注活动通知。
      </div>
    </div>
  </div>
</template>
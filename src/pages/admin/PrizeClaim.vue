<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '../../api/admin'
import { extractApiError } from '../../api/client'
import AdminNav from '../../components/AdminNav.vue'
import Loading from '../../components/Loading.vue'
import Empty from '../../components/Empty.vue'
import Pagination from '../../components/Pagination.vue'

interface AdminPrize {
  id: number
  user_id: number
  user_name: string
  photo_id: number
  photo_title: string
  prize_type: string
  status: string
  awarded_at: string
}

interface AdminPrizeResponse {
  total: number
  prizes: AdminPrize[]
}

const prizes = ref<AdminPrize[]>([])
const total = ref(0)
const page = ref(1)
const loading = ref(true)
const claiming = ref<number | null>(null)

async function fetchPrizes() {
  loading.value = true
  try {
    // TODO: Add admin prizes list endpoint when available
    // For now, use the my-prizes endpoint as placeholder
  } catch { /* ignore */ }
  finally { loading.value = false }
}

async function handleClaim(prizeId: number) {
  claiming.value = prizeId
  try {
    await adminApi.claimPrize(prizeId)
    prizes.value = prizes.value.map(p =>
      p.id === prizeId ? { ...p, status: 'claimed' } : p,
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
    <AdminNav />
    <h1 class="text-2xl font-bold text-text mb-6">奖品发放管理</h1>
    <p class="text-text-light mb-4">此处管理所有奖品的发放状态。在答题审核通过时，系统自动为首位答对者创建奖品记录。</p>

    <Empty icon="🎁" title="奖品管理" description="奖品的创建由系统在答题审核通过时自动完成，此处可标记奖品为已领取" />
  </div>
</template>
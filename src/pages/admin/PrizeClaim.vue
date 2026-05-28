<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '../../api/admin'
import { extractApiError } from '../../api/client'
import { formatDateTime } from '../../utils/format'
import AdminNav from '../../components/AdminNav.vue'
import Loading from '../../components/Loading.vue'
import Empty from '../../components/Empty.vue'
import Pagination from '../../components/Pagination.vue'
import type { AdminPrizeItem } from '../../types'

const prizes = ref<AdminPrizeItem[]>([])
const total = ref(0)
const page = ref(1)
const limit = 10
const loading = ref(true)
const claiming = ref<number | null>(null)
const statusFilter = ref('')

const statusLabel = (s: string) => s === 'claimed' ? '已领取' : '待领取'
const prizeTypeLabel = (t: string) => {
  const map: Record<string, string> = { physical: '实物奖品', digital: '数字奖品', other: '其他' }
  return map[t] || t
}

async function fetchPrizes() {
  loading.value = true
  try {
    const params: { page: number; limit: number; status?: string } = { page: page.value, limit }
    if (statusFilter.value) params.status = statusFilter.value
    const res = await adminApi.getPrizes(params)
    if (res.data.success) {
      const d = res.data.data
      total.value = d.total
      prizes.value = d.prizes
    }
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

function onStatusChange() {
  page.value = 1
  fetchPrizes()
}

onMounted(fetchPrizes)
</script>

<template>
  <div>
    <AdminNav />
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-text">奖品发放管理</h1>
      <select v-model="statusFilter" @change="onStatusChange" class="px-3 py-2 rounded-lg border border-border bg-card text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20">
        <option value="">全部</option>
        <option value="unclaimed">待领取</option>
        <option value="claimed">已领取</option>
      </select>
    </div>

    <Loading v-if="loading" />
    <Empty v-else-if="prizes.length === 0" icon="🎁" title="暂无奖品记录" description="奖品的创建由系统在答题审核通过时自动完成" />
    <template v-else>
      <div class="bg-card rounded-xl border border-border overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border bg-bg">
              <th class="text-left px-4 py-3 font-medium text-text-light">ID</th>
              <th class="text-left px-4 py-3 font-medium text-text-light">用户</th>
              <th class="text-left px-4 py-3 font-medium text-text-light">来源图片</th>
              <th class="text-left px-4 py-3 font-medium text-text-light">奖品类型</th>
              <th class="text-left px-4 py-3 font-medium text-text-light">状态</th>
              <th class="text-left px-4 py-3 font-medium text-text-light">获奖时间</th>
              <th class="text-right px-4 py-3 font-medium text-text-light">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prize in prizes" :key="prize.id" class="border-b border-border last:border-0 hover:bg-bg/50 transition-colors">
              <td class="px-4 py-3 text-text-light">{{ prize.id }}</td>
              <td class="px-4 py-3 text-text font-medium">{{ prize.user_name }}</td>
              <td class="px-4 py-3 text-text">{{ prize.photo_title }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                  {{ prizeTypeLabel(prize.prize_type) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', prize.status === 'claimed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700']">
                  {{ statusLabel(prize.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-text-light">{{ prize.awarded_at ? formatDateTime(prize.awarded_at) : '-' }}</td>
              <td class="px-4 py-3 text-right">
                <button
                  v-if="prize.status === 'unclaimed'"
                  @click="handleClaim(prize.id)"
                  :disabled="claiming === prize.id"
                  class="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-light disabled:opacity-50 transition-colors"
                >
                  {{ claiming === prize.id ? '处理中...' : '标记已领取' }}
                </button>
                <span v-else class="text-xs text-text-light">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-4">
        <Pagination :page="page" :total="total" :limit="limit" @change="(p: number) => { page = p; fetchPrizes() }" />
      </div>
    </template>
  </div>
</template>

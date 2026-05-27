<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { messagesApi } from '../api/messages'
import { formatTime } from '../utils/format'
import Loading from '../components/Loading.vue'
import Empty from '../components/Empty.vue'
import type { ConversationItem, ChatMessage } from '../types'

const conversations = ref<ConversationItem[]>([])
const loading = ref(true)
const activePartnerId = ref<number | null>(null)
const chatMessages = ref<ChatMessage[]>([])
const chatLoading = ref(false)
const chatSending = ref(false)
const chatInput = ref('')

async function fetchConversations() {
  loading.value = true
  try {
    const res = await messagesApi.conversations()
    if (res.data.success) {
      const d = res.data.data as unknown as { conversations: ConversationItem[] }
      conversations.value = d.conversations || []
    }
  } catch { /* ignore */ }
  finally { loading.value = false }
}

async function openConversation(partnerId: number) {
  activePartnerId.value = partnerId
  chatLoading.value = true
  chatMessages.value = []
  try {
    const res = await messagesApi.conversation(partnerId, { page: 1, limit: 20 })
    if (res.data.success) {
      const d = res.data.data as unknown as { messages: ChatMessage[] }
      chatMessages.value = (d.messages || []).filter(m => {
        if (partnerId === 1) return m.type !== 'chat'
        return true
      })
    }
  } catch { /* ignore */ }
  finally { chatLoading.value = false }
}

async function sendMessage() {
  if (!activePartnerId.value || !chatInput.value.trim()) return
  chatSending.value = true
  try {
    const res = await messagesApi.sendMessage(activePartnerId.value, chatInput.value.trim())
    if (res.data.success) {
      const msg = res.data.data as unknown as ChatMessage
      chatMessages.value.push(msg)
      chatInput.value = ''
    }
  } catch { /* ignore */ }
  finally { chatSending.value = false }
}

function fmt(time: string | undefined | null): string {
  if (!time) return ''
  return formatTime(time)
}

onMounted(fetchConversations)
</script>

<template>
  <div class="max-w-4xl mx-auto flex flex-col" style="height: calc(100vh - 130px)">
    <h1 class="text-2xl font-bold text-text mb-4 shrink-0">消息</h1>

    <Loading v-if="loading" />
    <Empty v-else-if="conversations.length === 0" icon="📭" title="暂无消息" description="有新通知时这里会显示" />

    <div v-else class="flex flex-1 bg-card rounded-xl border border-border overflow-hidden min-h-0">
      <!-- Conversation list -->
      <div class="w-1/3 border-r border-border overflow-y-auto flex-shrink-0">
        <div
          v-for="conv in conversations"
          :key="conv.partner_id"
          @click="openConversation(conv.partner_id)"
          :class="['px-4 py-3 cursor-pointer hover:bg-bg transition-colors border-b border-border', activePartnerId === conv.partner_id ? 'bg-primary/5' : '']"
        >
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
              {{ conv.partner_id === 1 ? '🔔' : (conv.partner_name || '?').charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-text truncate">{{ conv.partner_name || '未知' }}</span>
                <span class="text-xs text-text-light shrink-0 ml-2">{{ fmt(conv.last_time) }}</span>
              </div>
              <p class="text-xs text-text-light truncate mt-0.5">{{ conv.last_content || '' }}</p>
            </div>
            <span v-if="conv.unread_count > 0" class="bg-accent text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shrink-0">{{ conv.unread_count > 99 ? '99+' : conv.unread_count }}</span>
          </div>
        </div>
      </div>

      <!-- Chat area -->
      <div class="flex-1 flex flex-col min-w-0">
        <div v-if="!activePartnerId" class="flex-1 flex items-center justify-center text-text-light">
          选择一个会话开始聊天
        </div>
        <template v-else>
          <div class="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            <Loading v-if="chatLoading" text="加载中..." />
            <div v-else-if="chatMessages.length === 0" class="text-center text-text-light py-8">暂无消息</div>
            <template v-else>
              <div
                v-for="msg in chatMessages"
                :key="msg.id"
                :class="['flex', msg.is_mine ? 'justify-end' : 'justify-start']"
              >
                <div :class="['max-w-[75%] px-4 py-2.5 rounded-xl text-sm leading-relaxed', msg.is_mine ? 'bg-primary text-white' : 'bg-bg text-text']">
                  <p class="whitespace-pre-wrap">{{ msg.content }}</p>
                  <span class="text-[10px] opacity-50 mt-1.5 block">{{ fmt(msg.created_at) }}</span>
                </div>
              </div>
            </template>
          </div>
          <div class="border-t border-border p-3 flex gap-2 shrink-0">
            <input
              v-model="chatInput"
              type="text"
              placeholder="输入消息..."
              class="flex-1 px-3 py-2 rounded-lg border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              @keyup.enter="sendMessage"
            />
            <button @click="sendMessage" :disabled="chatSending || !chatInput.trim()" class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 transition-colors shrink-0">
              {{ chatSending ? '...' : '发送' }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
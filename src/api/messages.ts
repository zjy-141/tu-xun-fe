import client from './client'
import type {
  ApiResponse,
  MessagesResponse,
  UnreadCountResponse,
  ConversationItem,
  ConversationDetailResponse,
} from '../types'

export const messagesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    client.get<ApiResponse<MessagesResponse>>('/messages', { params: { page: params?.page || 1, limit: params?.limit || 20 } }),

  unreadCount: () =>
    client.get<ApiResponse<UnreadCountResponse>>('/messages/unread-count'),

  markAsRead: (id: number) =>
    client.put<ApiResponse<null>>(`/messages/${id}/read`),

  conversations: () =>
    client.get<ApiResponse<{ conversations: ConversationItem[] }>>('/conversations'),

  conversation: (partnerId: number, params?: { page?: number; limit?: number }) =>
    client.get<ApiResponse<ConversationDetailResponse>>(`/conversations/${partnerId}`, { params: { page: params?.page || 1, limit: params?.limit || 20 } }),

  sendMessage: (partnerId: number, content: string) =>
    client.post<ApiResponse<import('../types').ChatMessage>>(`/conversations/${partnerId}`, { content }),
}
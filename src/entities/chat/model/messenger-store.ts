import { create } from 'zustand'
import type { Message } from '@/entities/message'
import { CURRENT_USER_ID, type UserProfile } from '@/entities/user'
import { buildMockReply, mockDelay } from '@/entities/chat/api/mock-backend'
import {
  initialChats,
  initialMessagesByChatId,
  usersSeed,
} from '@/entities/chat/model/seed'
import type { Chat } from '@/entities/chat/model/types'

type UsersMap = Record<string, UserProfile>

function sortChatsList(chats: Chat[]): Chat[] {
  return [...chats].sort((a, b) => b.lastMessageAt - a.lastMessageAt)
}

interface MessengerState {
  users: UsersMap
  chats: Chat[]
  messagesByChatId: Record<string, Message[]>
  activeChatId: string | null
  sidebarSearch: string
  sendInFlight: Record<string, boolean>
}

interface MessengerActions {
  selectChat: (id: string | null) => void
  setSidebarSearch: (query: string) => void
  sendText: (text: string) => Promise<void>
}

function pickResponderId(chat: Chat): string {
  const others = chat.participantIds.filter((id) => id !== CURRENT_USER_ID)
  if (others.length === 0) return CURRENT_USER_ID
  return others[Math.floor(Math.random() * others.length)]!
}

export const useMessengerStore = create<MessengerState & MessengerActions>()(
  (set, get) => ({
    users: { ...usersSeed },
    chats: initialChats,
    messagesByChatId: structuredClone(initialMessagesByChatId),
    activeChatId: 'chat-alice',
    sidebarSearch: '',
    sendInFlight: {},

    selectChat: (id) =>
      set((s) => ({
        activeChatId: id,
        chats:
          id === null
            ? s.chats
            : s.chats.map((c) =>
                c.id === id ? { ...c, unreadCount: 0 } : c,
              ),
      })),

    setSidebarSearch: (query) => set({ sidebarSearch: query }),

    sendText: async (draft) => {
      const text = draft.trim()
      const chatId = get().activeChatId
      if (!chatId || !text) return

      const outgoing: Message = {
        id: crypto.randomUUID(),
        chatId,
        authorId: CURRENT_USER_ID,
        text,
        createdAt: Date.now(),
        delivery: 'sent',
      }

      set((s) => {
        const messages = [...(s.messagesByChatId[chatId] ?? []), outgoing]
        const chats = sortChatsList(
          s.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  lastMessageText: text,
                  lastMessageAt: outgoing.createdAt,
                  unreadCount: 0,
                }
              : c,
          ),
        )
        return {
          messagesByChatId: { ...s.messagesByChatId, [chatId]: messages },
          chats,
          sendInFlight: { ...s.sendInFlight, [chatId]: true },
        }
      })

      await mockDelay()

      set((s) => {
        const list = s.messagesByChatId[chatId] ?? []
        const next = list.map((m) =>
          m.id === outgoing.id ? { ...m, delivery: 'delivered' as const } : m,
        )
        return {
          messagesByChatId: { ...s.messagesByChatId, [chatId]: next },
        }
      })

      await mockDelay(400, 1100)

      const chat = get().chats.find((c) => c.id === chatId)
      if (!chat) {
        set((s) => ({
          sendInFlight: { ...s.sendInFlight, [chatId]: false },
        }))
        return
      }

      const peerId = pickResponderId(chat)
      const peer = get().users[peerId]
      const replyText = buildMockReply(chat.title, Boolean(peer?.isBot))

      const reply: Message = {
        id: crypto.randomUUID(),
        chatId,
        authorId: peerId,
        text: replyText,
        createdAt: Date.now(),
        delivery: 'read',
      }

      const active = get().activeChatId

      set((s) => {
        const messages = [...(s.messagesByChatId[chatId] ?? []), reply]
        const chats = sortChatsList(
          s.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  lastMessageText: replyText,
                  lastMessageAt: reply.createdAt,
                  unreadCount:
                    active === chatId
                      ? 0
                      : Math.min(99, (c.unreadCount ?? 0) + 1),
                }
              : c,
          ),
        )
        return {
          messagesByChatId: { ...s.messagesByChatId, [chatId]: messages },
          chats,
          sendInFlight: { ...s.sendInFlight, [chatId]: false },
        }
      })
    },
  }),
)

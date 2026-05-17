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

export type AppMainView = 'messenger' | 'settings' | 'profile'

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
  appMainView: AppMainView
  chatSettingsChatId: string | null
  compactChatBubble: boolean
  sendByEnter: boolean
  chatSearchOpen: boolean
  chatSearchQuery: string
  chatSearchActiveMatchIndex: number
}

interface MessengerActions {
  selectChat: (id: string | null) => void
  setSidebarSearch: (query: string) => void
  sendText: (text: string) => Promise<void>
  setAppMainView: (view: AppMainView) => void
  goToMessenger: () => void
  openChatSettings: (chatId: string) => void
  closeChatSettings: () => void
  updateMyProfile: (patch: Partial<Pick<UserProfile, 'displayName' | 'username'>>) => void
  setChatMuted: (chatId: string, muted: boolean) => void
  setGroupChatTitle: (chatId: string, title: string) => void
  clearChatHistory: (chatId: string) => void
  setCompactChatBubble: (value: boolean) => void
  setSendByEnter: (value: boolean) => void
  setChatSearchOpen: (open: boolean) => void
  setChatSearchQuery: (query: string) => void
  goToNextChatSearchMatch: () => void
  goToPrevChatSearchMatch: () => void
  /** Личный чат: при существующем direct с тем же peer — только переключение. */
  openOrCreateDirectChat: (peerUserId: string) => void
}

function pickResponderId(chat: Chat): string {
  const others = chat.participantIds.filter((id) => id !== CURRENT_USER_ID)
  if (others.length === 0) return CURRENT_USER_ID
  return others[Math.floor(Math.random() * others.length)]!
}

function chatSearchMatchIds(
  messages: Message[] | undefined,
  query: string,
): string[] {
  const q = query.trim().toLowerCase()
  if (!q || !messages?.length) return []
  return messages.filter((m) => m.text.toLowerCase().includes(q)).map((m) => m.id)
}

export const useMessengerStore = create<MessengerState & MessengerActions>()(
  (set, get) => ({
    users: { ...usersSeed },
    chats: initialChats,
    messagesByChatId: structuredClone(initialMessagesByChatId),
    activeChatId: 'chat-alice',
    sidebarSearch: '',
    sendInFlight: {},
    appMainView: 'messenger',
    chatSettingsChatId: null,
    compactChatBubble: false,
    sendByEnter: true,
    chatSearchOpen: false,
    chatSearchQuery: '',
    chatSearchActiveMatchIndex: 0,

    selectChat: (id) =>
      set((s) => ({
        activeChatId: id,
        chatSearchActiveMatchIndex: 0,
        chats:
          id === null
            ? s.chats
            : s.chats.map((c) =>
                c.id === id ? { ...c, unreadCount: 0 } : c,
              ),
      })),

    setSidebarSearch: (query) => set({ sidebarSearch: query }),

    setAppMainView: (view) =>
      set({
        appMainView: view,
        chatSettingsChatId: view !== 'messenger' ? null : get().chatSettingsChatId,
      }),

    goToMessenger: () =>
      set({
        appMainView: 'messenger',
        chatSettingsChatId: null,
      }),

    openChatSettings: (chatId) =>
      set({ chatSettingsChatId: chatId, chatSearchOpen: false }),

    closeChatSettings: () => set({ chatSettingsChatId: null }),

    updateMyProfile: (patch) =>
      set((s) => {
        const me = s.users[CURRENT_USER_ID]
        if (!me) return {}
        return {
          users: { ...s.users, [CURRENT_USER_ID]: { ...me, ...patch } },
        }
      }),

    setChatMuted: (chatId, muted) =>
      set((s) => ({
        chats: s.chats.map((c) => (c.id === chatId ? { ...c, muted } : c)),
      })),

    setGroupChatTitle: (chatId, title) => {
      const nextTitle = title.trim()
      if (!nextTitle) return
      set((s) => ({
        chats: s.chats.map((c) =>
          c.id === chatId && c.type === 'group' ? { ...c, title: nextTitle } : c,
        ),
      }))
    },

    clearChatHistory: (chatId) =>
      set((s) => {
        const now = Date.now()
        return {
          messagesByChatId: { ...s.messagesByChatId, [chatId]: [] },
          chats: sortChatsList(
            s.chats.map((c) =>
              c.id === chatId
                ? {
                    ...c,
                    lastMessageText: 'История очищена',
                    lastMessageAt: now,
                  }
                : c,
            ),
          ),
          chatSearchActiveMatchIndex: 0,
        }
      }),

    setCompactChatBubble: (value) => set({ compactChatBubble: value }),

    setSendByEnter: (value) => set({ sendByEnter: value }),

    setChatSearchOpen: (open) =>
      set((s) => {
        const chatId = s.activeChatId
        const messages = chatId ? s.messagesByChatId[chatId] : undefined
        const matches = chatSearchMatchIds(messages, s.chatSearchQuery)
        return {
          chatSearchOpen: open,
          chatSearchActiveMatchIndex:
            open && matches.length > 0
              ? Math.min(s.chatSearchActiveMatchIndex, matches.length - 1)
              : 0,
        }
      }),

    setChatSearchQuery: (query) =>
      set(() => ({
        chatSearchQuery: query,
        chatSearchActiveMatchIndex: 0,
      })),

    goToNextChatSearchMatch: () =>
      set((s) => {
        const chatId = s.activeChatId
        if (!chatId) return s
        const matches = chatSearchMatchIds(
          s.messagesByChatId[chatId],
          s.chatSearchQuery,
        )
        if (matches.length === 0) return { chatSearchActiveMatchIndex: 0 }
        const next = (s.chatSearchActiveMatchIndex + 1) % matches.length
        return { chatSearchActiveMatchIndex: next }
      }),

    goToPrevChatSearchMatch: () =>
      set((s) => {
        const chatId = s.activeChatId
        if (!chatId) return s
        const matches = chatSearchMatchIds(
          s.messagesByChatId[chatId],
          s.chatSearchQuery,
        )
        if (matches.length === 0) return { chatSearchActiveMatchIndex: 0 }
        const next =
          (s.chatSearchActiveMatchIndex - 1 + matches.length) % matches.length
        return { chatSearchActiveMatchIndex: next }
      }),

    openOrCreateDirectChat: (peerUserId) => {
      if (peerUserId === CURRENT_USER_ID) return
      const state = get()
      const peer = state.users[peerUserId]
      if (!peer) return

      const existing = state.chats.find(
        (c) => c.type === 'direct' && c.peerUserId === peerUserId,
      )
      if (existing) {
        get().selectChat(existing.id)
        return
      }

      const id = crypto.randomUUID()
      const now = Date.now()
      const chat: Chat = {
        id,
        type: 'direct',
        title: peer.displayName,
        participantIds: [CURRENT_USER_ID, peerUserId],
        peerUserId,
        lastMessageText: '',
        lastMessageAt: now,
        unreadCount: 0,
      }

      set((s) => ({
        chats: sortChatsList([...s.chats, chat]),
        messagesByChatId: { ...s.messagesByChatId, [id]: [] },
        activeChatId: id,
        chatSearchActiveMatchIndex: 0,
        chatSearchOpen: false,
        chatSettingsChatId: null,
      }))
    },

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

import type { Chat } from '@/entities/chat/model/types'
import type { Message } from '@/entities/message/model/types'
import type { UserProfile } from '@/entities/user/model/types'
import { CURRENT_USER_ID } from '@/entities/user/model/constants'

const now = Date.now()
const minute = 60_000

export const usersSeed: Record<string, UserProfile> = {
  [CURRENT_USER_ID]: {
    id: CURRENT_USER_ID,
    displayName: 'Вы',
    username: 'me',
    avatarHue: 205,
  },
  'user-alice': {
    id: 'user-alice',
    displayName: 'Алиса Петрова',
    username: 'alice',
    avatarHue: 320,
  },
  'user-bogdan': {
    id: 'user-bogdan',
    displayName: 'Богдан Сергеевич',
    username: 'bogdan_s',
    avatarHue: 38,
  },
  'user-otus-bot': {
    id: 'user-otus-bot',
    displayName: 'Поддержка Otus',
    username: 'otus_support',
    avatarHue: 156,
    isBot: true,
  },
}

export const chatsSeed: Chat[] = [
  {
    id: 'chat-alice',
    type: 'direct',
    title: usersSeed['user-alice'].displayName,
    participantIds: [CURRENT_USER_ID, 'user-alice'],
    peerUserId: 'user-alice',
    lastMessageText: 'Ок, тогда жду макеты до пятницы.',
    lastMessageAt: now - 5 * minute,
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 'chat-group-fe',
    type: 'group',
    title: 'Курс · Front-end',
    participantIds: [
      CURRENT_USER_ID,
      'user-alice',
      'user-bogdan',
      'user-otus-bot',
    ],
    lastMessageText: 'Богдан: залил обновлённый README в репозиторий.',
    lastMessageAt: now - 45 * minute,
    unreadCount: 0,
  },
  {
    id: 'chat-bogdan',
    type: 'direct',
    title: usersSeed['user-bogdan'].displayName,
    participantIds: [CURRENT_USER_ID, 'user-bogdan'],
    peerUserId: 'user-bogdan',
    lastMessageText: 'Напомни, пожалуйста, дедлайн по ДЗ.',
    lastMessageAt: now - 3 * 60 * minute,
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: 'chat-otus',
    type: 'direct',
    title: usersSeed['user-otus-bot'].displayName,
    participantIds: [CURRENT_USER_ID, 'user-otus-bot'],
    peerUserId: 'user-otus-bot',
    lastMessageText: 'Добрый день! Чем могу помочь по курсу?',
    lastMessageAt: now - 26 * 60 * minute,
    unreadCount: 1,
  },
]

function sortChats(chats: Chat[]): Chat[] {
  return [...chats].sort((a, b) => b.lastMessageAt - a.lastMessageAt)
}

export const initialChats = sortChats(chatsSeed)

export const initialMessagesByChatId: Record<string, Message[]> = {
  'chat-alice': [
    {
      id: 'm-a1',
      chatId: 'chat-alice',
      authorId: CURRENT_USER_ID,
      text: 'Привет! Сможешь глянуть PR с формой логина?',
      createdAt: now - 120 * minute,
      delivery: 'read',
    },
    {
      id: 'm-a2',
      chatId: 'chat-alice',
      authorId: 'user-alice',
      text: 'Да, гляну сегодня вечером. Там же только валидация?',
      createdAt: now - 118 * minute,
      delivery: 'read',
    },
    {
      id: 'm-a3',
      chatId: 'chat-alice',
      authorId: CURRENT_USER_ID,
      text: 'Да, плюс небольшой рефактор хука.',
      createdAt: now - 115 * minute,
      delivery: 'read',
    },
    {
      id: 'm-a4',
      chatId: 'chat-alice',
      authorId: 'user-alice',
      text: 'Ок, тогда жду макеты до пятницы.',
      createdAt: now - 5 * minute,
      delivery: 'read',
    },
  ],
  'chat-group-fe': [
    {
      id: 'm-g1',
      chatId: 'chat-group-fe',
      authorId: 'user-otus-bot',
      text: 'Напоминание: завтра созвон в 19:00 по МСК.',
      createdAt: now - 180 * minute,
      delivery: 'read',
    },
    {
      id: 'm-g2',
      chatId: 'chat-group-fe',
      authorId: 'user-alice',
      text: 'Запишите, пожалуйста, если кто не попадёт — скинем запись.',
      createdAt: now - 170 * minute,
      delivery: 'read',
    },
    {
      id: 'm-g3',
      chatId: 'chat-group-fe',
      authorId: 'user-bogdan',
      text: 'Залил обновлённый README в репозиторий.',
      createdAt: now - 45 * minute,
      delivery: 'read',
    },
  ],
  'chat-bogdan': [
    {
      id: 'm-b1',
      chatId: 'chat-bogdan',
      authorId: 'user-bogdan',
      text: 'Напомни, пожалуйста, дедлайн по ДЗ.',
      createdAt: now - 3 * 60 * minute,
      delivery: 'read',
    },
  ],
  'chat-otus': [
    {
      id: 'm-o1',
      chatId: 'chat-otus',
      authorId: 'user-otus-bot',
      text: 'Добрый день! Чем могу помочь по курсу?',
      createdAt: now - 26 * 60 * minute,
      delivery: 'read',
    },
  ],
}

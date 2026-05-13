import type { UserId } from '@/entities/user'

export type MessageDelivery = 'sent' | 'delivered' | 'read'

export interface Message {
  id: string
  chatId: string
  authorId: UserId
  text: string
  createdAt: number
  delivery: MessageDelivery
}

import { useEffect, useMemo, useRef } from 'react'
import type { Message } from '@/entities/message'
import { CURRENT_USER_ID } from '@/entities/user'
import { MessageItem } from './MessageItem'

interface MessageListProps {
  chatId: string
  messages: Message[]
  usersById: Record<string, { displayName: string }>
  searchQuery: string
  searchMatchIds: string[]
  searchActiveIndex: number
  compactBubbles: boolean
}

export function MessageList({
  chatId,
  messages,
  usersById,
  searchQuery,
  searchMatchIds,
  searchActiveIndex,
  compactBubbles,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const lastMessageId = messages[messages.length - 1]?.id

  const safeMatchIndex =
    searchMatchIds.length > 0
      ? Math.min(
          Math.max(searchActiveIndex, 0),
          searchMatchIds.length - 1,
        )
      : 0

  const activeHitId =
    searchMatchIds.length > 0 ? searchMatchIds[safeMatchIndex] : undefined

  const autoScrollEnabled = useMemo(() => {
    const q = searchQuery.trim()
    if (!q) return true
    return !searchMatchIds.length
  }, [searchQuery, searchMatchIds.length])

  useEffect(() => {
    if (!autoScrollEnabled) return
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [autoScrollEnabled, chatId, messages.length, lastMessageId])

  useEffect(() => {
    const q = searchQuery.trim()
    if (!q || !activeHitId) return
    const el = document.querySelector<HTMLElement>(
      `[data-message-id="${CSS.escape(activeHitId)}"]`,
    )
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeHitId, chatId, searchQuery])

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#0e1621] pb-2 pt-4">
      <div className="mt-auto flex w-full flex-col">
        {messages.map((m) => {
          const senderName =
            m.authorId !== CURRENT_USER_ID
              ? usersById[m.authorId]?.displayName
              : undefined
          return (
            <MessageItem
              key={m.id}
              message={m}
              senderName={senderName}
              compact={compactBubbles}
              searchQuery={searchQuery}
              activeSearchHit={Boolean(activeHitId && m.id === activeHitId)}
            />
          )
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

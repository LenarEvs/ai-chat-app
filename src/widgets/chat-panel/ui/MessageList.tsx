import { useEffect, useMemo, useRef } from 'react'
import { Check, CheckCheck } from 'lucide-react'
import type { Message } from '@/entities/message'
import { CURRENT_USER_ID } from '@/entities/user'
import { cn } from '@/shared/lib/cn'
import { formatMessageTime } from '@/shared/lib/format-time'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function HighlightedText({
  text,
  query,
}: {
  text: string
  query: string
}) {
  const q = query.trim()
  if (!q) return <>{text}</>

  const re = new RegExp(`(${escapeRegExp(q)})`, 'gi')
  const parts = text.split(re)

  return (
    <>
      {parts.map((part, i) => {
        const isHit = part.toLowerCase() === q.toLowerCase()
        if (!isHit) return <span key={i}>{part}</span>
        return (
          <mark
            key={i}
            className="rounded bg-amber-400/35 px-0.5 text-inherit [text-decoration:inherit]"
          >
            {part}
          </mark>
        )
      })}
    </>
  )
}

interface MessageBubbleProps {
  message: Message
  senderName?: string
  compact: boolean
  searchQuery: string
  activeSearchHit: boolean
}

function DeliveryTicks({ delivery }: { delivery: Message['delivery'] }) {
  const baseClass = '-mt-px shrink-0'

  if (delivery === 'sent') {
    return (
      <Check
        size={15}
        strokeWidth={2.25}
        className={cn(baseClass, 'text-white/45')}
        aria-hidden
      />
    )
  }

  if (delivery === 'delivered') {
    return (
      <CheckCheck
        size={15}
        strokeWidth={2.25}
        className={cn(baseClass, 'text-white/45')}
        aria-hidden
      />
    )
  }

  return (
    <CheckCheck
      size={15}
      strokeWidth={2.25}
      className={cn(baseClass, 'text-sky-300')}
      aria-hidden
    />
  )
}

function DeliveryMeta({
  mine,
  delivery,
  timeLabel,
}: {
  mine: boolean
  delivery: Message['delivery']
  timeLabel: string
}) {
  return (
    <div className="mt-2 flex shrink-0 items-center justify-end gap-1 whitespace-nowrap text-[11px] tabular-nums text-white/[0.62]">
      <span>{timeLabel}</span>
      {mine ? <DeliveryTicks delivery={delivery} /> : null}
    </div>
  )
}

export function MessageBubble({
  message,
  senderName,
  compact,
  searchQuery,
  activeSearchHit,
}: MessageBubbleProps) {
  const mine = message.authorId === CURRENT_USER_ID
  const bg = mine ? 'bg-[#2b5278]' : 'bg-[#182533]'
  const timeLabel = formatMessageTime(message.createdAt)

  return (
    <div
      className={cn(
        'flex px-4',
        compact ? 'py-0' : 'py-0.5',
        mine ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        data-message-id={message.id}
        className={cn(
          'relative max-w-[min(760px,calc(100%-4px))] scroll-mt-24 rounded-2xl px-3 py-2 ring-1 ring-black/35 transition-shadow',
          bg,
          mine ? 'rounded-br-md' : 'rounded-bl-md',
          activeSearchHit && 'ring-2 ring-amber-300/80 ring-offset-0',
        )}
      >
        {!mine && senderName ? (
          <div className="mb-2 text-[13px] font-semibold leading-tight text-sky-300/95">
            {senderName}
          </div>
        ) : null}

        <div className="text-[15px] leading-snug text-slate-100 [overflow-wrap:anywhere]">
          <p className="m-0 whitespace-pre-wrap">
            <HighlightedText text={message.text} query={searchQuery} />
          </p>
          <DeliveryMeta mine={mine} delivery={message.delivery} timeLabel={timeLabel} />
        </div>
      </div>
    </div>
  )
}

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
            <MessageBubble
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

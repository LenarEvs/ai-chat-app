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

export interface MessageItemProps {
  message: Message
  senderName?: string
  compact: boolean
  searchQuery: string
  activeSearchHit: boolean
}

export function MessageItem({
  message,
  senderName,
  compact,
  searchQuery,
  activeSearchHit,
}: MessageItemProps) {
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

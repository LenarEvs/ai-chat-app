import { useEffect, useRef } from 'react'
import { Check, CheckCheck } from 'lucide-react'
import type { Message } from '@/entities/message'
import { CURRENT_USER_ID } from '@/entities/user'
import { cn } from '@/shared/lib/cn'
import { formatMessageTime } from '@/shared/lib/format-time'

interface MessageBubbleProps {
  message: Message
  senderName?: string
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

export function MessageBubble({ message, senderName }: MessageBubbleProps) {
  const mine = message.authorId === CURRENT_USER_ID
  const bg = mine ? 'bg-[#2b5278]' : 'bg-[#182533]'
  const timeLabel = formatMessageTime(message.createdAt)

  return (
    <div
      className={cn('flex px-4 py-0.5', mine ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'relative max-w-[min(760px,calc(100%-4px))] rounded-2xl px-3 py-2 ring-1 ring-black/35',
          bg,
          mine ? 'rounded-br-md' : 'rounded-bl-md',
        )}
      >
        {!mine && senderName ? (
          <div className="mb-2 text-[13px] font-semibold leading-tight text-sky-300/95">
            {senderName}
          </div>
        ) : null}

        <div className="text-[15px] leading-snug text-slate-100 [overflow-wrap:anywhere]">
          <p className="m-0 whitespace-pre-wrap">{message.text}</p>
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
}

export function MessageList({ chatId, messages, usersById }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const lastMessageId = messages[messages.length - 1]?.id

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [chatId, messages.length, lastMessageId])

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-[#0e1621] pb-2 pt-4">
      {messages.map((m) => {
        const senderName =
          m.authorId !== CURRENT_USER_ID
            ? usersById[m.authorId]?.displayName
            : undefined
        return <MessageBubble key={m.id} message={m} senderName={senderName} />
      })}
      <div ref={bottomRef} />
    </div>
  )
}

import { useEffect, useRef } from 'react'
import type { Message } from '@/entities/message'
import { CURRENT_USER_ID } from '@/entities/user'
import { cn } from '@/shared/lib/cn'
import { formatMessageTime } from '@/shared/lib/format-time'

interface MessageBubbleProps {
  message: Message
  senderName?: string
}

/** Пузырьки сообщений в цветах, близких к Telegram */
function BubbleTailMine() {
  return (
    <span
      className="pointer-events-none absolute bottom-[-1px] right-[-8px] h-[10px] w-[10px] text-[#2b5278]"
      aria-hidden
    >
      <svg viewBox="0 0 8 13" width="10" height="14" fill="currentColor">
        <path d="M1.533 11.957a1 1 0 01-.64-.229.998.998 0 01-.367-.855V1.272A3.99 3.99 0 014.557 7.96h4.076a1 1 0 01.707 1.707l-7.708 7.291z" />
      </svg>
    </span>
  )
}

function BubbleTailTheir() {
  return (
    <span
      className="pointer-events-none absolute bottom-[-1px] left-[-8px] h-[10px] w-[10px] text-[#182533]"
      aria-hidden
    >
      <svg viewBox="0 0 8 13" width="10" height="14" fill="currentColor">
        <path d="M6.466 11.957a1 1 0 00.641-.229.998.998 0 00.367-.855V1.272A3.99 3.99 0 003.442 7.96H-.634a1 1 0 00-.707 1.707l7.707 7.291z" />
      </svg>
    </span>
  )
}

function DeliveryTicks({
  mine,
  delivery,
}: {
  mine: boolean
  delivery: Message['delivery']
}) {
  if (!mine) return null
  const read = delivery === 'read'

  return (
    <span
      className={cn(
        'ml-2 inline-flex shrink-0 items-center gap-[-3px] text-[14px]',
        read ? 'text-sky-300' : 'text-slate-400/95',
      )}
      aria-label={delivery}
      title={
        delivery === 'sent'
          ? 'Отправлено'
          : delivery === 'delivered'
            ? 'Доставлено'
            : 'Прочитано'
      }
    >
      <span className="translate-x-[1px]">✓</span>
      <span className="-ml-[10px]">✓</span>
    </span>
  )
}

export function MessageBubble({ message, senderName }: MessageBubbleProps) {
  const mine = message.authorId === CURRENT_USER_ID

  return (
    <div
      className={cn('flex px-5 py-[2px]', mine ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'relative inline-flex max-w-[min(720px,calc(100%-16px))] flex-col rounded-2xl px-3 pb-2 pt-[7px]',
          mine
            ? 'rounded-br-none bg-[#2b5278]'
            : 'rounded-bl-none bg-[#182533]',
        )}
      >
        {!mine && senderName ? (
          <span className="mb-1 text-[13px] font-semibold text-sky-300/95">
            {senderName}
          </span>
        ) : null}
        <div className="flex items-end gap-1 whitespace-pre-wrap break-words text-[15px] leading-snug text-slate-100">
          <p className="min-w-[40px] pr-12">{message.text}</p>
        </div>
        <span className={cn('-mt-[18px] flex items-center justify-end text-[11px] text-white/58')}>
          <span>{formatMessageTime(message.createdAt)}</span>
          <DeliveryTicks mine={mine} delivery={message.delivery} />
        </span>

        {mine ? <BubbleTailMine /> : <BubbleTailTheir />}
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

import { useMessengerStore } from '@/entities/chat'
import { Avatar } from '@/shared/ui/Avatar'
import { ChevronLeft, Ellipsis, Search } from 'lucide-react'

interface ChatHeaderProps {
  chatId: string
  onBack?: () => void
  showBack?: boolean
}

export function ChatHeader({ chatId, onBack, showBack }: ChatHeaderProps) {
  const chat = useMessengerStore((s) => s.chats.find((c) => c.id === chatId))
  const users = useMessengerStore((s) => s.users)

  if (!chat) return null

  const peer = chat.peerUserId ? users[chat.peerUserId] : undefined

  const subtitle =
    chat.type === 'group'
      ? `${chat.participantIds.length} участников`
      : chat.isOnline
        ? 'онлайн'
        : peer?.username
          ? `@${peer.username}`
          : 'был недавно'

  const hue =
    chat.type === 'direct' && chat.peerUserId
      ? peer?.avatarHue ?? 200
      : 215

  return (
    <header className="flex items-center gap-3 border-b border-black/35 bg-[#17212b] px-3 py-[10px]">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-200 hover:bg-white/5 md:hidden"
          aria-label="Назад к списку"
        >
          <ChevronLeft
            size={22}
            strokeWidth={1.75}
            className="shrink-0"
            aria-hidden
          />
        </button>
      ) : null}

      <Avatar
        label={chat.title}
        hue={hue}
        online={Boolean(chat.type === 'direct' && chat.isOnline)}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[16px] font-semibold text-slate-100">
          {chat.title}
        </div>
        <div className="truncate text-[13px] text-sky-400/95">{subtitle}</div>
      </div>

      <button
        type="button"
        className="hidden h-10 w-10 items-center justify-center rounded-full text-slate-300 hover:bg-white/5 md:inline-flex"
        title="Поиск по чату (мок)"
      >
        <Search size={20} strokeWidth={1.75} className="shrink-0" aria-hidden />
      </button>

      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-300 hover:bg-white/5"
        title="Меню (мок)"
      >
        <Ellipsis size={22} strokeWidth={1.75} className="shrink-0" aria-hidden />
      </button>
    </header>
  )
}

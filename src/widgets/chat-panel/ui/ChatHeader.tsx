import { useMessengerStore } from '@/entities/chat'
import { Avatar } from '@/shared/ui/Avatar'

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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" />
          </svg>
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 18a8 8 0 118-8 8 8 0 01-8 8zm11 2l-4-4 1.4-1.4 4 4L21 20zM10 5a7 7 0 107 7 7 7 0 00-7-7z" />
        </svg>
      </button>

      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-300 hover:bg-white/5"
        title="Меню (мок)"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>
    </header>
  )
}

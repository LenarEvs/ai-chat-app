import { useEffect, useRef, useState } from 'react'
import { useMessengerStore } from '@/entities/chat'
import { Avatar } from '@/shared/ui/Avatar'
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Ellipsis,
  Search,
  X,
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'

interface ChatHeaderProps {
  chatId: string
  onBack?: () => void
  showBack?: boolean
}

export function ChatHeader({ chatId, onBack, showBack }: ChatHeaderProps) {
  const chat = useMessengerStore((s) => s.chats.find((c) => c.id === chatId))
  const users = useMessengerStore((s) => s.users)
  const chatSearchOpen = useMessengerStore((s) => s.chatSearchOpen)
  const setChatSearchOpen = useMessengerStore((s) => s.setChatSearchOpen)
  const chatSearchQuery = useMessengerStore((s) => s.chatSearchQuery)
  const setChatSearchQuery = useMessengerStore((s) => s.setChatSearchQuery)
  const messagesByChatId = useMessengerStore((s) => s.messagesByChatId)
  const goToNextChatSearchMatch = useMessengerStore(
    (s) => s.goToNextChatSearchMatch,
  )
  const goToPrevChatSearchMatch = useMessengerStore(
    (s) => s.goToPrevChatSearchMatch,
  )
  const chatSearchActiveMatchIndex = useMessengerStore(
    (s) => s.chatSearchActiveMatchIndex,
  )
  const openChatSettings = useMessengerStore((s) => s.openChatSettings)

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const el = menuRef.current
      if (!el) return
      if (e.target instanceof Node && !el.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [menuOpen])

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

  const messages = messagesByChatId[chatId] ?? []
  const q = chatSearchQuery.trim().toLowerCase()
  const matchIds =
    q && messages.length
      ? messages.filter((m) => m.text.toLowerCase().includes(q)).map((m) => m.id)
      : []
  const matchCount = matchIds.length
  const matchLabel =
    matchCount > 0
      ? `${chatSearchActiveMatchIndex + 1}/${matchCount}`
      : q
        ? '0/0'
        : ''

  return (
    <div className="shrink-0 border-b border-black/35 bg-[#17212b]">
      <header className="flex items-center gap-3 px-3 py-[10px]">
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
            {chat.muted ? (
              <span className="ml-2 text-[12px] font-medium text-slate-500">
                без звука
              </span>
            ) : null}
          </div>
          <div className="truncate text-[13px] text-sky-400/95">{subtitle}</div>
        </div>

        <button
          type="button"
          onClick={() => setChatSearchOpen(!chatSearchOpen)}
          className={cn(
            'hidden h-10 w-10 items-center justify-center rounded-full md:inline-flex',
            chatSearchOpen
              ? 'bg-sky-500/15 text-sky-200'
              : 'text-slate-300 hover:bg-white/5',
          )}
          title={chatSearchOpen ? 'Закрыть поиск' : 'Поиск по чату'}
          aria-pressed={chatSearchOpen}
        >
          {chatSearchOpen ? (
            <X size={20} strokeWidth={1.75} className="shrink-0" aria-hidden />
          ) : (
            <Search size={20} strokeWidth={1.75} className="shrink-0" aria-hidden />
          )}
        </button>

        <button
          type="button"
          onClick={() => setChatSearchOpen(!chatSearchOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-300 hover:bg-white/5 md:hidden"
          title={chatSearchOpen ? 'Закрыть поиск' : 'Поиск по чату'}
          aria-pressed={chatSearchOpen}
        >
          {chatSearchOpen ? (
            <X size={20} strokeWidth={1.75} className="shrink-0" aria-hidden />
          ) : (
            <Search size={20} strokeWidth={1.75} className="shrink-0" aria-hidden />
          )}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full text-slate-300 hover:bg-white/5',
              menuOpen && 'bg-white/5',
            )}
            title="Меню чата"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <Ellipsis size={22} strokeWidth={1.75} className="shrink-0" aria-hidden />
          </button>

          {menuOpen ? (
            <div
              className="absolute right-0 top-[calc(100%+8px)] z-30 min-w-[220px] overflow-hidden rounded-2xl bg-[#24303f] py-2 text-[14px] shadow-xl shadow-black/40 ring-1 ring-white/10"
              role="menu"
            >
              <button
                type="button"
                role="menuitem"
                className="flex w-full px-4 py-3 text-left text-slate-100 hover:bg-white/5"
                onClick={() => {
                  setMenuOpen(false)
                  openChatSettings(chatId)
                }}
              >
                Настройки чата
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {chatSearchOpen ? (
        <div className="flex items-center gap-2 border-t border-black/25 px-3 py-3 md:px-4">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 flex h-[18px] w-[18px] -translate-y-1/2 items-center justify-center text-slate-400">
              <Search size={18} strokeWidth={1.75} className="shrink-0" />
            </span>
            <input
              type="search"
              value={chatSearchQuery}
              onChange={(e) => setChatSearchQuery(e.target.value)}
              placeholder="Слово или фраза в сообщениях"
              className="h-10 w-full rounded-[22px] border border-transparent bg-black/35 pl-[38px] pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-500/50"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              autoFocus
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToPrevChatSearchMatch()}
              disabled={matchCount === 0}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/5',
                matchCount === 0
                  ? 'cursor-not-allowed text-slate-600'
                  : 'text-slate-200',
              )}
              title="Предыдущее вхождение"
            >
              <ChevronUp size={20} strokeWidth={1.75} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => goToNextChatSearchMatch()}
              disabled={matchCount === 0}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/5',
                matchCount === 0
                  ? 'cursor-not-allowed text-slate-600'
                  : 'text-slate-200',
              )}
              title="Следующее вхождение"
            >
              <ChevronDown size={20} strokeWidth={1.75} aria-hidden />
            </button>
          </div>

          <div className="w-[52px] shrink-0 text-right text-[12px] tabular-nums text-slate-400">
            {matchLabel || ' '}
          </div>
        </div>
      ) : null}
    </div>
  )
}

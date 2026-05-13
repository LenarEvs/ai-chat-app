import { useMemo } from 'react'
import type { UserProfile } from '@/entities/user'
import type { Chat } from '@/entities/chat'
import { useMessengerStore } from '@/entities/chat'
import { Avatar } from '@/shared/ui/Avatar'
import { cn } from '@/shared/lib/cn'
import { formatChatListTime } from '@/shared/lib/format-time'

function ChatRow({
  chat,
  users,
  active,
  onSelect,
}: {
  chat: Chat
  users: Record<string, UserProfile>
  active: boolean
  onSelect: () => void
}) {
  const subtitle = chat.lastMessageText
  const time = formatChatListTime(chat.lastMessageAt)
  const peerHue =
    chat.type === 'direct' && chat.peerUserId
      ? users[chat.peerUserId]?.avatarHue ?? 200
      : 215
  const title = chat.title
  const online = Boolean(chat.type === 'direct' && chat.isOnline)

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full gap-3 px-3 py-3 text-left transition-colors hover:bg-white/[0.04]',
        active && 'bg-sky-500/12',
      )}
    >
      <Avatar label={title} hue={peerHue} online={online} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-[15px] font-semibold text-slate-100">
            {title}
          </span>
          <span className="ml-auto shrink-0 text-[12px] text-slate-500">
            {time}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-[13px] text-slate-400">
            {subtitle}
          </span>
          {chat.unreadCount > 0 ? (
            <span className="inline-flex min-w-[22px] justify-center rounded-full bg-sky-500 px-[7px] py-[2px] text-[12px] font-semibold tabular-nums text-[#17212b]">
              {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  )
}

export function ChatSidebar({ className }: { className?: string }) {
  const chats = useMessengerStore((s) => s.chats)
  const users = useMessengerStore((s) => s.users)
  const activeChatId = useMessengerStore((s) => s.activeChatId)
  const selectChat = useMessengerStore((s) => s.selectChat)
  const sidebarSearch = useMessengerStore((s) => s.sidebarSearch)
  const setSidebarSearch = useMessengerStore((s) => s.setSidebarSearch)

  const filtered = useMemo(() => {
    const q = sidebarSearch.trim().toLowerCase()
    if (!q) return chats
    return chats.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.lastMessageText.toLowerCase().includes(q),
    )
  }, [chats, sidebarSearch])

  return (
    <aside
      className={cn(
        'flex min-h-0 w-[min(380px,100%)] shrink-0 flex-col border-black/35 bg-[#17212b] md:border-r',
        className,
      )}
    >
      <div className="border-b border-black/35 px-4 pb-2 pt-[14px]">
        <div className="mx-auto mb-3 flex items-center gap-2">
          <div className="relative flex min-w-0 flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 18a8 8 0 118-8 8 8 0 01-8 8zm11 2l-4-4 1.4-1.4 4 4L21 20zM10 5a7 7 0 107 7 7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              type="search"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Поиск"
              className="h-10 w-full rounded-[22px] border border-transparent bg-black/35 pl-[38px] pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-500/50"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 divide-y divide-black/20 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-5 py-8 text-center text-[13px] text-slate-500">
            Ничего не найдено по запросу
          </div>
        ) : (
          filtered.map((chat) => (
            <ChatRow
              key={chat.id}
              chat={chat}
              users={users}
              active={chat.id === activeChatId}
              onSelect={() => selectChat(chat.id)}
            />
          ))
        )}
      </div>
    </aside>
  )
}

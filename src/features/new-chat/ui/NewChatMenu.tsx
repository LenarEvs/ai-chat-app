import { useEffect, useMemo, useRef, useState } from 'react'
import { CURRENT_USER_ID, type UserProfile } from '@/entities/user'
import { useMessengerStore } from '@/entities/chat'
import { Avatar } from '@/shared/ui/Avatar'
import { MessageSquarePlus } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export function NewChatMenu({ className }: { className?: string }) {
  const users = useMessengerStore((s) => s.users)
  const openOrCreateDirectChat = useMessengerStore(
    (s) => s.openOrCreateDirectChat,
  )

  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const peers = useMemo(() => {
    const list: { id: string; profile: UserProfile }[] = []
    for (const id of Object.keys(users)) {
      if (id === CURRENT_USER_ID) continue
      const profile = users[id]
      if (profile) list.push({ id, profile })
    }
    list.sort((a, b) =>
      a.profile.displayName.localeCompare(b.profile.displayName, 'ru'),
    )
    return list
  }, [users])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const t = e.target
      if (!(t instanceof Node)) return
      if (wrapRef.current?.contains(t)) return
      setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  return (
    <div ref={wrapRef} className={cn('relative shrink-0', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex h-10 max-w-[140px] items-center gap-1.5 rounded-[22px] border border-transparent bg-black/35 px-3 text-left text-[13px] font-medium text-slate-100 outline-none transition-colors hover:bg-black/45 focus-visible:border-sky-500/50 sm:max-w-none sm:gap-2"
        title="Новый чат"
      >
        <MessageSquarePlus
          size={18}
          strokeWidth={1.75}
          className="shrink-0 text-slate-300"
          aria-hidden
        />
        <span className="truncate">Новый чат</span>
      </button>

      {open ? (
        <div
          className="absolute left-0 top-[calc(100%+6px)] z-[100] min-w-[min(100vw-2rem,280px)] max-w-[min(100vw-2rem,320px)] overflow-hidden rounded-2xl bg-[#24303f] py-2 shadow-xl shadow-black/40 ring-1 ring-white/10"
          role="listbox"
          aria-label="Выберите собеседника"
        >
          <div className="border-b border-white/10 px-3 py-2 text-[12px] font-medium uppercase tracking-wide text-slate-500">
            Начать чат с…
          </div>
          <div className="max-h-[min(50vh,260px)] overflow-y-auto py-1">
            {peers.map(({ id, profile }) => (
              <button
                key={id}
                type="button"
                role="option"
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[14px] text-slate-100 transition-colors hover:bg-white/5"
                onClick={() => {
                  openOrCreateDirectChat(id)
                  setOpen(false)
                }}
              >
                <Avatar
                  label={profile.displayName}
                  hue={profile.avatarHue}
                  online={false}
                />
                <span className="min-w-0 flex-1 truncate font-medium">
                  {profile.displayName}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

import { type FormEvent, useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useMessengerStore } from '@/entities/chat'
import { CURRENT_USER_ID } from '@/entities/user'
import { Avatar } from '@/shared/ui/Avatar'
import { cn } from '@/shared/lib/cn'

export function ProfileView({
  className,
  showBack,
  onBack,
}: {
  className?: string
  showBack?: boolean
  onBack?: () => void
}) {
  const users = useMessengerStore((s) => s.users)
  const updateMyProfile = useMessengerStore((s) => s.updateMyProfile)

  const me = users[CURRENT_USER_ID]
  const [displayName, setDisplayName] = useState(me?.displayName ?? '')
  const [username, setUsername] = useState(me?.username ?? '')

  const hue = me?.avatarHue ?? 205
  const dirty = useMemo(() => {
    return (
      displayName.trim() !== (me?.displayName ?? '') ||
      username.trim().replace(/^@/, '') !== (me?.username ?? '')
    )
  }, [displayName, me?.displayName, me?.username, username])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const nextName = displayName.trim()
    const rawUser = username.trim().replace(/^@/, '')
    if (!nextName) return
    updateMyProfile({
      displayName: nextName,
      username: rawUser || undefined,
    })
    setDisplayName(nextName)
    setUsername(rawUser)
  }

  if (!me) return null

  return (
    <section
      className={cn(
        'flex min-h-0 min-w-0 flex-1 flex-col bg-[#0e1621]',
        className,
      )}
    >
      <header className="flex items-center gap-2 border-b border-black/35 bg-[#17212b] px-3 py-3">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-200 hover:bg-white/5"
            aria-label="Назад"
          >
            <ChevronLeft size={22} strokeWidth={1.75} aria-hidden />
          </button>
        ) : null}
        <h1 className="min-w-0 flex-1 truncate text-[17px] font-semibold text-slate-100">
          Профиль
        </h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-5">
          <Avatar label={me.displayName} hue={hue} size="lg" />

          <form className="w-full space-y-4" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="profile-display-name"
                className="mb-2 block text-[13px] font-medium text-slate-400"
              >
                Отображаемое имя
              </label>
              <input
                id="profile-display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-11 w-full rounded-2xl border border-transparent bg-black/35 px-4 text-[15px] text-slate-100 outline-none focus:border-sky-500/50"
                autoComplete="name"
              />
            </div>

            <div>
              <label
                htmlFor="profile-username"
                className="mb-2 block text-[13px] font-medium text-slate-400"
              >
                Имя пользователя
              </label>
              <input
                id="profile-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@nickname"
                className="h-11 w-full rounded-2xl border border-transparent bg-black/35 px-4 text-[15px] text-slate-100 outline-none focus:border-sky-500/50"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>

            <button
              type="submit"
              disabled={!dirty || !displayName.trim()}
              className={cn(
                'h-11 w-full rounded-2xl text-[15px] font-semibold transition-colors',
                dirty && displayName.trim()
                  ? 'bg-sky-500 text-[#0f1b26] hover:bg-sky-400'
                  : 'cursor-not-allowed bg-slate-800 text-slate-500',
              )}
            >
              Сохранить
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

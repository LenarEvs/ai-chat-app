import { type FormEvent, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useMessengerStore } from '@/entities/chat'
import { cn } from '@/shared/lib/cn'

export function ChatSettingsView({
  chatId,
  className,
}: {
  chatId: string
  className?: string
}) {
  const chat = useMessengerStore((s) => s.chats.find((c) => c.id === chatId))
  const closeChatSettings = useMessengerStore((s) => s.closeChatSettings)
  const setChatMuted = useMessengerStore((s) => s.setChatMuted)
  const setGroupChatTitle = useMessengerStore((s) => s.setGroupChatTitle)
  const clearChatHistory = useMessengerStore((s) => s.clearChatHistory)

  const [titleDraft, setTitleDraft] = useState(
    () =>
      useMessengerStore.getState().chats.find((c) => c.id === chatId)?.title ?? '',
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeChatSettings()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeChatSettings])

  if (!chat) return null

  const onSaveTitle = (e: FormEvent) => {
    e.preventDefault()
    if (chat.type !== 'group') return
    setGroupChatTitle(chatId, titleDraft)
  }

  return (
    <div
      className={cn(
        'absolute inset-0 z-20 flex flex-col bg-[#0e1621]/98 backdrop-blur-[2px]',
        className,
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Настройки чата"
    >
      <header className="flex items-center gap-2 border-b border-black/35 bg-[#17212b] px-3 py-3">
        <button
          type="button"
          onClick={closeChatSettings}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-200 hover:bg-white/5"
          aria-label="Закрыть"
        >
          <X size={22} strokeWidth={1.75} aria-hidden />
        </button>
        <h2 className="min-w-0 flex-1 truncate text-[17px] font-semibold text-slate-100">
          Настройки чата
        </h2>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto max-w-lg space-y-4">
          <div className="rounded-2xl bg-[#17212b] px-4 py-4 ring-1 ring-black/35">
            <div className="truncate text-[16px] font-semibold text-slate-100">
              {chat.title}
            </div>
            <div className="mt-1 text-[13px] text-slate-500">
              {chat.type === 'group' ? 'Групповой чат' : 'Личный чат'}
            </div>
          </div>

          <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl bg-[#17212b] px-4 py-4 ring-1 ring-black/35">
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-slate-100">
                Без звука
              </div>
              <div className="mt-1 text-[13px] text-slate-400">
                Уведомления для этого чата приглушены (локально).
              </div>
            </div>
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 accent-sky-500"
              checked={Boolean(chat.muted)}
              onChange={(e) => setChatMuted(chatId, e.target.checked)}
            />
          </label>

          {chat.type === 'group' ? (
            <form
              onSubmit={onSaveTitle}
              className="space-y-3 rounded-2xl bg-[#17212b] p-4 ring-1 ring-black/35"
            >
              <div className="text-[15px] font-semibold text-slate-100">
                Название группы
              </div>
              <input
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                className="h-11 w-full rounded-2xl border border-transparent bg-black/35 px-4 text-[15px] text-slate-100 outline-none focus:border-sky-500/50"
              />
              <button
                type="submit"
                disabled={!titleDraft.trim() || titleDraft.trim() === chat.title}
                className={cn(
                  'h-11 w-full rounded-2xl text-[15px] font-semibold transition-colors',
                  titleDraft.trim() && titleDraft.trim() !== chat.title
                    ? 'bg-sky-500 text-[#0f1b26] hover:bg-sky-400'
                    : 'cursor-not-allowed bg-slate-800 text-slate-500',
                )}
              >
                Сохранить название
              </button>
            </form>
          ) : null}

          <div className="rounded-2xl bg-[#17212b] p-4 ring-1 ring-black/35">
            <div className="text-[15px] font-semibold text-rose-200">
              Опасная зона
            </div>
            <p className="mt-2 text-[13px] text-slate-400">
              Очистка удаляет сообщения в этом демо-приложении без восстановления.
            </p>
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Очистить историю сообщений в этом чате?',
                  )
                ) {
                  clearChatHistory(chatId)
                  closeChatSettings()
                }
              }}
              className="mt-4 h-11 w-full rounded-2xl bg-rose-500/15 text-[15px] font-semibold text-rose-100 hover:bg-rose-500/25"
            >
              Очистить историю
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

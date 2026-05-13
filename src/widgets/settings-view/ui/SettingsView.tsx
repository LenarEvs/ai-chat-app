import { ChevronLeft } from 'lucide-react'
import { useMessengerStore } from '@/entities/chat'
import { cn } from '@/shared/lib/cn'

export function SettingsView({
  className,
  showBack,
  onBack,
}: {
  className?: string
  showBack?: boolean
  onBack?: () => void
}) {
  const compactChatBubble = useMessengerStore((s) => s.compactChatBubble)
  const setCompactChatBubble = useMessengerStore((s) => s.setCompactChatBubble)
  const sendByEnter = useMessengerStore((s) => s.sendByEnter)
  const setSendByEnter = useMessengerStore((s) => s.setSendByEnter)

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
          Настройки
        </h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-5 text-[13px] text-slate-500">
          Локальные настройки интерфейса (без сервера).
        </p>

        <div className="space-y-4">
          <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl bg-[#17212b] px-4 py-4 ring-1 ring-black/35">
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-slate-100">
                Компактные сообщения
              </div>
              <div className="mt-1 text-[13px] text-slate-400">
                Меньшие отступы в пузырях.
              </div>
            </div>
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 accent-sky-500"
              checked={compactChatBubble}
              onChange={(e) => setCompactChatBubble(e.target.checked)}
            />
          </label>

          <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl bg-[#17212b] px-4 py-4 ring-1 ring-black/35">
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-slate-100">
                Enter отправляет сообщение
              </div>
              <div className="mt-1 text-[13px] text-slate-400">
                Выкл: Enter переносит строку, отправка — кнопкой.
              </div>
            </div>
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 accent-sky-500"
              checked={sendByEnter}
              onChange={(e) => setSendByEnter(e.target.checked)}
            />
          </label>
        </div>
      </div>
    </section>
  )
}

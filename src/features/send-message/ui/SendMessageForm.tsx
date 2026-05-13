import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useMessengerStore } from '@/entities/chat'
import { cn } from '@/shared/lib/cn'

/** Поле ввода сообщения и отправка в мок-бэкенд через zustand */
export function SendMessageForm() {
  const activeChatId = useMessengerStore((s) => s.activeChatId)
  const sendText = useMessengerStore((s) => s.sendText)
  const sending = useMessengerStore((s) =>
    activeChatId ? Boolean(s.sendInFlight[activeChatId]) : false,
  )

  const [value, setValue] = useState('')

  const canSend = useMemo(
    () => Boolean(activeChatId) && Boolean(value.trim()) && !sending,
    [activeChatId, sending, value],
  )

  const submit = useCallback(async () => {
    if (!canSend) return
    const draft = value
    setValue('')
    await sendText(draft)
  }, [canSend, sendText, value])

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void submit()
    }
  }

  if (!activeChatId) return null

  return (
    <footer className="border-t border-black/35 bg-[#17212b] px-3 pb-[max(env(safe-area-inset-bottom,0px),10px)] pt-2 md:pb-3 md:pt-3">
      <form
        className="mx-auto flex w-full max-w-[920px] items-end gap-2"
        onSubmit={(e: FormEvent) => {
          e.preventDefault()
          void submit()
        }}
      >
        <button
          type="button"
          className={cn(
            'mb-[3px] flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full text-slate-300 hover:bg-white/6',
          )}
          title="Вложения (мок)"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 6v11a4.5 4.5 0 01-9 0V9a3 3 0 016 0v8a1.5 1.5 0 01-3 0V11h2v6c0 .8.8 1.5 2 1.5s2-.7 2-1.5V9c0-2.2-1.8-4-4-4S7 6.8 7 9v11a6 6 0 0012 0V6h-2.5z" />
          </svg>
        </button>

        <div className="relative min-w-0 flex-1">
          <textarea
            value={value}
            disabled={sending}
            rows={1}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Сообщение…"
            className="max-h-40 min-h-[46px] w-full resize-none rounded-[22px] border border-transparent bg-black/35 px-[18px] py-[12px] text-[15px] leading-snug text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-500/45 disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={!canSend}
          className={cn(
            'mb-[3px] flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full font-semibold text-[#17212b] shadow-sm',
            canSend
              ? 'bg-sky-400 hover:bg-sky-300'
              : 'cursor-not-allowed bg-slate-700/60 text-slate-300/40',
          )}
          title="Отправить"
          aria-label="Отправить сообщение"
        >
          {sending ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#17212b]/30 border-t-[#17212b]" />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </form>
    </footer>
  )
}

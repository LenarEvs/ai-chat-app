import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { Loader2, Paperclip, Send } from 'lucide-react'
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
    <footer className="border-t border-black/35 bg-[#17212b] pb-[max(env(safe-area-inset-bottom),10px)] pt-3 md:pb-4 md:pt-4">
      <form
        className="flex w-full max-w-none px-3 sm:px-4 md:px-6"
        onSubmit={(e: FormEvent) => {
          e.preventDefault()
          void submit()
        }}
      >
        <div
          className={cn(
            'flex w-full min-h-[52px] items-end gap-0 rounded-[26px]',
            'border border-white/[0.08] bg-[#24303f]/98',
            'shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
            'pl-2 pr-1.5 py-1.5 md:min-h-[56px]',
          )}
        >
          <button
            type="button"
            className={cn(
              'mb-[2px] flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-slate-300',
              'hover:bg-white/[0.08] active:bg-white/[0.12]',
            )}
            title="Вложения (мок)"
          >
            <Paperclip size={21} strokeWidth={1.75} className="shrink-0" />
          </button>

          <textarea
            value={value}
            disabled={sending}
            rows={1}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Напишите сообщение..."
            className={cn(
              'max-h-[12.5rem] min-h-[44px] w-full resize-none px-3 py-[11px] text-[15px] leading-relaxed text-slate-100',
              'rounded-[999px] bg-transparent outline-none md:min-h-[46px]',
              'placeholder:text-slate-500',
              'focus-visible:outline-none disabled:opacity-55',
            )}
          />

          <button
            type="submit"
            disabled={!canSend}
            className={cn(
              'mb-[2px] flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full font-semibold',
              'transition-[transform,box-shadow,color] duration-150',
              canSend
                ? 'bg-gradient-to-br from-sky-300 to-sky-500 text-[#0f1b26] shadow-md shadow-black/25 hover:-translate-y-px hover:from-sky-200 hover:to-sky-400'
                : 'cursor-not-allowed bg-slate-800/90 text-slate-500 shadow-none',
            )}
            title="Отправить"
            aria-label="Отправить сообщение"
          >
            {sending ? (
              <Loader2
                size={21}
                strokeWidth={2}
                className="shrink-0 animate-spin text-[#0f1b26]"
                aria-hidden
              />
            ) : (
              <Send size={20} strokeWidth={1.85} className="shrink-0" aria-hidden />
            )}
          </button>
        </div>
      </form>
    </footer>
  )
}

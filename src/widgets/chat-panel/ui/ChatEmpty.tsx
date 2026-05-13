import { AppLogo } from '@/shared/ui/AppLogo'
import { cn } from '@/shared/lib/cn'

interface ChatEmptyProps {
  className?: string
}

/** Пустое состояние панели, когда диалог не выбран */
export function ChatEmpty({ className }: ChatEmptyProps) {
  return (
    <main
      className={cn(
        'relative flex min-h-0 min-w-0 flex-1 items-center justify-center bg-[linear-gradient(180deg,#17212b_0%,#0e1621_75%)]',
        className,
      )}
    >
      <div className="max-w-[360px] px-6 text-center">
        <div className="mx-auto mb-5 flex justify-center">
          <AppLogo variant="hero" />
        </div>
        <h2 className="text-lg font-semibold text-slate-100">
          Otus Messenger · мок
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Слева — список чатов. Сообщения уходят в локальный стор: задержки и
          ответы имитируют бэкенд.
        </p>
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23ffffff'/%3E%3C/svg%3E\")",
          backgroundSize: '14px 14px',
        }}
      />
    </main>
  )
}

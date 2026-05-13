import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

interface NavBtnProps {
  title: string
  children: ReactNode
  active?: boolean
}

function NavButton({ title, children, active }: NavBtnProps) {
  return (
    <button
      type="button"
      title={title}
      className={cn(
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] text-sky-300/95 transition-colors hover:bg-white/5',
        active && 'bg-sky-500/15 text-sky-200',
      )}
    >
      {children}
    </button>
  )
}

export function NavigationRail({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'flex w-[72px] shrink-0 flex-col items-center gap-3 border-r border-black/35 bg-[#0f1b26] py-4',
        className,
      )}
    >
      <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/90 text-xl font-black text-[#17212b] shadow-inner ring-2 ring-black/35">
        O
      </div>

      <NavButton title="Все чаты" active>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 4h16v14H9l-4 3v-17zm2 12h12V6H6v10zM8 8h8v2H8V8zm0 4h5v2H8v-2z" />
        </svg>
      </NavButton>
      <NavButton title="Контакты">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 11a3 3 0 100-6 3 3 0 000 6zM19 21v-1a6 6 0 00-6-6H11a6 6 0 00-6 6v1h14zm-17 0v-1a10 10 0 016.5-9.5A6 6 0 1120 8.3V20H2z" />
        </svg>
      </NavButton>
      <NavButton title="Настройки (мок)">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.82 21h-3.64l-.36-3.1a7.93 7.93 0 01-2.28-1l-2.93 1.25-2.56-4.43 2.53-2a8.06 8.06 0 010-4.44l-2.53-2 2.56-4.43 2.93 1.25a7.93 7.93 0 012.28-1L10.18 3h3.64l.36 3.1a7.93 7.93 0 012.28 1l2.93-1.25 2.56 4.43-2.53 2c.48.93.71 2 .71 3.06s-.23 2.13-.71 3.06l2.53 2-2.56 4.43-2.93-1.25a7.93 7.93 0 01-2.28 1l-.36 3.1zm-1.71-11a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
        </svg>
      </NavButton>

      <div className="mt-auto flex flex-col gap-3">
        <NavButton title="Ещё (мок)">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </NavButton>
      </div>
    </aside>
  )
}

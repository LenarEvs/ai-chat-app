import type { ReactNode } from 'react'
import { Ellipsis, MessageSquare, Settings, User } from 'lucide-react'
import { AppLogo } from '@/shared/ui/AppLogo'
import { cn } from '@/shared/lib/cn'

const navIcon = { size: 22 as const, strokeWidth: 1.75, className: 'shrink-0' }

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
      <div className="mb-1">
        <AppLogo variant="rail" />
      </div>

      <NavButton title="Все чаты" active>
        <MessageSquare {...navIcon} />
      </NavButton>
      <NavButton title="Контакты">
        <User {...navIcon} />
      </NavButton>
      <NavButton title="Настройки (мок)">
        <Settings {...navIcon} />
      </NavButton>

      <div className="mt-auto flex flex-col gap-3">
        <NavButton title="Ещё (мок)">
          <Ellipsis {...navIcon} />
        </NavButton>
      </div>
    </aside>
  )
}

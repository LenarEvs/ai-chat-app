import { MessagesSquare } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

interface AppLogoProps {
  variant?: 'rail' | 'hero'
  className?: string
}

/** Фирменная эмблема вместо буквы O: блок чатов + градиент */
export function AppLogo({ variant = 'rail', className }: AppLogoProps) {
  const hero = variant === 'hero'

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-3xl',
        'bg-gradient-to-br from-sky-200 via-sky-400 to-sky-600 shadow-lg ring-2 ring-black/35',
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-gradient-to-t after:from-black/25 after:to-transparent',
        hero ? 'size-16 sm:size-[4.75rem]' : 'size-11',
        className,
      )}
      aria-hidden
    >
      <MessagesSquare
        size={hero ? 38 : 20}
        strokeWidth={hero ? 1.6 : 2}
        className="-translate-y-px shrink-0 text-[#0e1621] drop-shadow-sm"
      />
    </div>
  )
}

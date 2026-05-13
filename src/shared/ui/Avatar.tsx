import { cn } from '@/shared/lib/cn'

interface AvatarProps {
  label: string
  hue: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** Индикатор «в сети» как в Telegram */
  online?: boolean
}

const sizeCls: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-[15px]',
  lg: 'h-14 w-14 text-lg',
}

export function Avatar({
  label,
  hue,
  size = 'md',
  className,
  online,
}: AvatarProps) {
  const initial = label.trim().charAt(0).toUpperCase() || '?'
  const ring = 'ring-[var(--surface-rail,#0e1621)]'

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-semibold text-white ring-2 ring-black/25',
          sizeCls[size],
        )}
        style={{ backgroundColor: `hsl(${hue} 65% 40%)` }}
        aria-hidden
      >
        {initial}
      </div>
      {online ? (
        <span
          className={cn(
            'absolute bottom-px right-px h-[11px] w-[11px] rounded-full bg-emerald-400 ring-2',
            ring,
          )}
        />
      ) : null}
    </div>
  )
}

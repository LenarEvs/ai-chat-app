import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { Ellipsis, MessageSquare, Settings, User } from 'lucide-react'
import type { AppMainView } from '@/entities/chat'
import { useMessengerStore } from '@/entities/chat'
import { AppLogo } from '@/shared/ui/AppLogo'
import { cn } from '@/shared/lib/cn'

const navIcon = { size: 22 as const, strokeWidth: 1.75, className: 'shrink-0' }

interface NavBtnProps {
  title: string
  children: ReactNode
  active?: boolean
  onClick?: () => void
}

function NavButton({ title, children, active, onClick }: NavBtnProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
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
  const appMainView = useMessengerStore((s) => s.appMainView)
  const setAppMainView = useMessengerStore((s) => s.setAppMainView)
  const goToMessenger = useMessengerStore((s) => s.goToMessenger)

  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })

  const updateMenuPosition = useCallback(() => {
    const wrap = moreRef.current
    const menu = menuRef.current
    if (!wrap || !menu) return

    const rect = wrap.getBoundingClientRect()
    const menuH = menu.offsetHeight
    const menuW = menu.offsetWidth
    const pad = 8
    const gap = 8

    let top = rect.top + rect.height / 2 - menuH / 2
    top = Math.max(pad, Math.min(top, window.innerHeight - pad - menuH))

    let left = rect.right + gap
    if (left + menuW > window.innerWidth - pad) {
      left = rect.left - gap - menuW
    }
    left = Math.max(pad, Math.min(left, window.innerWidth - pad - menuW))

    setMenuPos({ top, left })
  }, [])

  useLayoutEffect(() => {
    if (!moreOpen) return
    updateMenuPosition()
  }, [moreOpen, updateMenuPosition])

  useLayoutEffect(() => {
    if (!moreOpen) return
    const menu = menuRef.current
    if (!menu) return
    const ro = new ResizeObserver(() => updateMenuPosition())
    ro.observe(menu)
    return () => ro.disconnect()
  }, [moreOpen, updateMenuPosition])

  useEffect(() => {
    if (!moreOpen) return
    const onScrollOrResize = () => updateMenuPosition()
    window.addEventListener('resize', onScrollOrResize)
    window.visualViewport?.addEventListener('resize', onScrollOrResize)
    window.visualViewport?.addEventListener('scroll', onScrollOrResize)
    return () => {
      window.removeEventListener('resize', onScrollOrResize)
      window.visualViewport?.removeEventListener('resize', onScrollOrResize)
      window.visualViewport?.removeEventListener('scroll', onScrollOrResize)
    }
  }, [moreOpen, updateMenuPosition])

  useEffect(() => {
    if (!moreOpen) return
    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const t = e.target
      if (!(t instanceof Node)) return
      if (moreRef.current?.contains(t)) return
      if (menuRef.current?.contains(t)) return
      setMoreOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [moreOpen])

  const go = (view: AppMainView) => {
    setAppMainView(view)
    setMoreOpen(false)
  }

  return (
    <aside
      className={cn(
        'flex h-full min-h-0 w-[72px] shrink-0 flex-col items-center gap-3 border-r border-black/35 bg-[#0f1b26] py-4',
        className,
      )}
    >
      <div className="mb-1">
        <AppLogo variant="rail" />
      </div>

      <NavButton
        title="Все чаты"
        active={appMainView === 'messenger'}
        onClick={() => goToMessenger()}
      >
        <MessageSquare {...navIcon} />
      </NavButton>
      <NavButton
        title="Профиль"
        active={appMainView === 'profile'}
        onClick={() => go('profile')}
      >
        <User {...navIcon} />
      </NavButton>
      <NavButton
        title="Настройки"
        active={appMainView === 'settings'}
        onClick={() => go('settings')}
      >
        <Settings {...navIcon} />
      </NavButton>

      <div className="mt-auto flex w-full flex-col items-center">
        <div ref={moreRef}>
          <NavButton
            title="Ещё"
            active={moreOpen}
            onClick={() => setMoreOpen((v) => !v)}
          >
            <Ellipsis {...navIcon} />
          </NavButton>
        </div>
      </div>

      {moreOpen ? (
        <div
          ref={menuRef}
          style={{ top: menuPos.top, left: menuPos.left }}
          className={cn(
            'fixed z-[200] min-w-[200px] rounded-2xl bg-[#24303f] py-2 text-[14px]',
            'shadow-xl shadow-black/40 ring-1 ring-white/10',
          )}
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full px-4 py-3 text-left text-slate-100 hover:bg-white/5"
            onClick={() => go('profile')}
          >
            Профиль
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full px-4 py-3 text-left text-slate-100 hover:bg-white/5"
            onClick={() => go('settings')}
          >
            Настройки
          </button>
          <div className="my-2 h-px bg-white/10" />
          <div className="px-4 py-2 text-[12px] text-slate-500">ai-chat-app v0.0.0</div>
        </div>
      ) : null}
    </aside>
  )
}

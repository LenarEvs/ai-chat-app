import { NavigationRail } from '@/widgets/navigation-rail/ui/NavigationRail'
import { ChatSidebar } from '@/widgets/chat-sidebar/ui/ChatSidebar'
import { ChatPanel } from '@/widgets/chat-panel/ui/ChatPanel'
import { cn } from '@/shared/lib/cn'
import { useIsNarrowScreen } from '@/shared/lib/use-media-query'
import { useMessengerStore } from '@/entities/chat'

/** Главный экран: рейл, список чатов и переписка (адаптивно как в мобильном Telegram). */
export function MessengerPage() {
  const activeChatId = useMessengerStore((s) => s.activeChatId)
  const narrow = useIsNarrowScreen()

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#0e1621] text-slate-100">
      {!narrow ? <NavigationRail /> : null}

      <div className="relative flex min-h-0 min-w-0 flex-1">
        {(!narrow || !activeChatId) && (
          <ChatSidebar
            className={cn(narrow && activeChatId ? 'hidden' : 'flex')}
          />
        )}

        <ChatPanel
          className={cn(narrow && !activeChatId ? 'hidden' : 'flex')}
          showBack={narrow && Boolean(activeChatId)}
        />
      </div>
    </div>
  )
}

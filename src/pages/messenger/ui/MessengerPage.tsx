import { NavigationRail } from '@/widgets/navigation-rail/ui/NavigationRail'
import { ChatSidebar } from '@/widgets/chat-sidebar/ui/ChatSidebar'
import { ChatPanel } from '@/widgets/chat-panel/ui/ChatPanel'
import { SettingsView } from '@/widgets/settings-view/ui/SettingsView'
import { ProfileView } from '@/widgets/profile-view/ui/ProfileView'
import { cn } from '@/shared/lib/cn'
import { useIsNarrowScreen } from '@/shared/lib/use-media-query'
import { useMessengerStore } from '@/entities/chat'

/** Главный экран: рейл, список чатов и переписка (адаптивно как в мобильном Telegram). */
export function MessengerPage() {
  const activeChatId = useMessengerStore((s) => s.activeChatId)
  const appMainView = useMessengerStore((s) => s.appMainView)
  const goToMessenger = useMessengerStore((s) => s.goToMessenger)
  const narrow = useIsNarrowScreen()

  const showMessengerChrome = appMainView === 'messenger'

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#0e1621] text-slate-100">
      {!narrow ? <NavigationRail /> : null}

      <div className="relative flex min-h-0 min-w-0 flex-1">
        {showMessengerChrome ? (
          <>
            {(!narrow || !activeChatId) && (
              <ChatSidebar
                className={cn(narrow && activeChatId ? 'hidden' : 'flex')}
              />
            )}

            <ChatPanel
              className={cn(narrow && !activeChatId ? 'hidden' : 'flex')}
              showBack={narrow && Boolean(activeChatId)}
            />
          </>
        ) : null}

        {!showMessengerChrome && appMainView === 'settings' ? (
          <SettingsView
            className="flex min-w-0 flex-1"
            showBack={narrow}
            onBack={() => goToMessenger()}
          />
        ) : null}

        {!showMessengerChrome && appMainView === 'profile' ? (
          <ProfileView
            className="flex min-w-0 flex-1"
            showBack={narrow}
            onBack={() => goToMessenger()}
          />
        ) : null}
      </div>
    </div>
  )
}

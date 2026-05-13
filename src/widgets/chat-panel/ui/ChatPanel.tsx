import { useMessengerStore } from '@/entities/chat'
import { cn } from '@/shared/lib/cn'
import { ChatEmpty } from '@/widgets/chat-panel/ui/ChatEmpty'
import { ChatHeader } from '@/widgets/chat-panel/ui/ChatHeader'
import { MessageList } from '@/widgets/chat-panel/ui/MessageList'
import { SendMessageForm } from '@/features/send-message'
import { ChatSettingsView } from '@/widgets/chat-settings-view/ui/ChatSettingsView'

interface ChatPanelProps {
  className?: string
  showBack?: boolean
}

/** Правая колонка: шапка, лента сообщений и поле ввода */
export function ChatPanel({ className, showBack }: ChatPanelProps) {
  const activeChatId = useMessengerStore((s) => s.activeChatId)
  const chatSettingsChatId = useMessengerStore((s) => s.chatSettingsChatId)
  const selectChat = useMessengerStore((s) => s.selectChat)
  const messagesByChatId = useMessengerStore((s) => s.messagesByChatId)
  const users = useMessengerStore((s) => s.users)
  const chatSearchQuery = useMessengerStore((s) => s.chatSearchQuery)
  const chatSearchActiveMatchIndex = useMessengerStore(
    (s) => s.chatSearchActiveMatchIndex,
  )
  const compactChatBubble = useMessengerStore((s) => s.compactChatBubble)

  if (!activeChatId) {
    return (
      <div className={cn('relative flex min-h-0 min-w-0 flex-1', className)}>
        <ChatEmpty />
      </div>
    )
  }

  const messages = messagesByChatId[activeChatId] ?? []
  const q = chatSearchQuery.trim().toLowerCase()
  const searchMatchIds =
    q && messages.length
      ? messages.filter((m) => m.text.toLowerCase().includes(q)).map((m) => m.id)
      : []

  return (
    <section
      className={cn(
        'relative flex min-h-0 min-w-0 flex-1 flex-col bg-[#0e1621]',
        className,
      )}
    >
      <ChatHeader
        chatId={activeChatId}
        showBack={showBack}
        onBack={() => selectChat(null)}
      />
      <MessageList
        chatId={activeChatId}
        messages={messages}
        usersById={users}
        searchQuery={chatSearchQuery}
        searchMatchIds={searchMatchIds}
        searchActiveIndex={chatSearchActiveMatchIndex}
        compactBubbles={compactChatBubble}
      />
      <SendMessageForm />
      {chatSettingsChatId === activeChatId ? (
        <ChatSettingsView key={activeChatId} chatId={activeChatId} />
      ) : null}
    </section>
  )
}

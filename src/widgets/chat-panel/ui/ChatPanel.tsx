import { useMessengerStore } from '@/entities/chat'
import { cn } from '@/shared/lib/cn'
import { ChatEmpty } from '@/widgets/chat-panel/ui/ChatEmpty'
import { ChatHeader } from '@/widgets/chat-panel/ui/ChatHeader'
import { MessageList } from '@/widgets/chat-panel/ui/MessageList'
import { SendMessageForm } from '@/features/send-message'

interface ChatPanelProps {
  className?: string
  showBack?: boolean
}

/** Правая колонка: шапка, лента сообщений и поле ввода */
export function ChatPanel({ className, showBack }: ChatPanelProps) {
  const activeChatId = useMessengerStore((s) => s.activeChatId)
  const selectChat = useMessengerStore((s) => s.selectChat)
  const messagesByChatId = useMessengerStore((s) => s.messagesByChatId)
  const users = useMessengerStore((s) => s.users)

  if (!activeChatId) {
    return (
      <div className={cn('relative flex min-h-0 min-w-0 flex-1', className)}>
        <ChatEmpty />
      </div>
    )
  }

  const messages = messagesByChatId[activeChatId] ?? []

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
      />
      <SendMessageForm />
    </section>
  )
}

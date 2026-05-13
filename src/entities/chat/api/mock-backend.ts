/** Имитация сетевой задержки мок-бэкенда */
export function mockDelay(minMs = 250, maxMs = 700): Promise<void> {
  const ms = minMs + Math.random() * (maxMs - minMs)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function buildMockReply(chatTitle: string, isBot: boolean): string {
  if (isBot) {
    return 'Я бот-поддержка (мок). Сообщение получено — типовой ответ: проверьте раздел «Материалы» и напишите номер урока.'
  }
  return `Принял 🙂 Это автоответ для «${chatTitle}». Когда подключим реальный бэкенд, здесь будет живой диалог.`
}

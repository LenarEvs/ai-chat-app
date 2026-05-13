export type UserId = string

export interface UserProfile {
  id: UserId
  displayName: string
  username?: string
  /** 0–360 для стабильного цвета аватара */
  avatarHue: number
  isBot?: boolean
}

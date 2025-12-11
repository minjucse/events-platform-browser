export type UserRole = "user" | "host" | "admin"

export type EventStatus = "open" | "full" | "cancelled" | "completed"

export type EventCategory =
  | "concert"
  | "sports"
  | "hiking"
  | "gaming"
  | "food"
  | "art"
  | "tech"
  | "music"
  | "wellness"
  | "social"

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  avatar?: string
  bio?: string
  interests: string[]
  location?: string
  createdAt: string
  rating: number
  reviewCount: number
}

export interface Event {
  id: string
  name: string
  description: string
  category: EventCategory
  date: string
  time: string
  location: string
  address: string
  image: string
  hostId: string
  host: User
  minParticipants: number
  maxParticipants: number
  currentParticipants: number
  participants: User[]
  fee: number
  status: EventStatus
  createdAt: string
}

export interface Review {
  id: string
  eventId: string
  userId: string
  user: User
  hostId: string
  rating: number
  comment: string
  createdAt: string
}

export interface Booking {
  id: string
  eventId: string
  event: Event
  userId: string
  user: User
  status: "confirmed" | "pending" | "cancelled"
  paidAmount: number
  bookedAt: string
}

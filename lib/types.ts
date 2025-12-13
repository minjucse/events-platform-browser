export type UserRole = "USER" | "HOST" | "ADMIN";

export type EventStatus =
  | "OPEN"
  | "FULL"
  | "UPCOMING"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED"
  | "CLOSED"
  | "PENDING";

export type EventCategory = string;

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phoneNumber?: string;
  profilePhoto?: string;
  avatar?: string;
  address?: string;
  bio?: string;
  interests: string[];
  location?: string;
  gender?: string;
  dateOfBirth?: string;
  pertcipatedEvents?: number;
  hostedEvents?: number;
  reviewCount: number;
  status?: string;
  isEmailVerified?: boolean;
  createdAt: string;
  rating?: number;
  averageRating?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  eventImage: string;
  eventCategory: EventCategory;
  date: string;
  time: string;
  location: string;
  minParticipants: number;
  maxParticipants: number;
  currentParticipants: number;
  joiningFee: number;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    profilePhoto?: string;
  };
}

export interface Review {
  id: string;
  eventId: string;
  userId: string;
  user: User;
  hostId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  eventId: string;
  event: Event;
  userId: string;
  user: User;
  status: "confirmed" | "pending" | "cancelled";
  paidAmount: number;
  bookedAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  eventId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  event: {
    id: string;
    title: string;
    joiningFee: number;
  };
}

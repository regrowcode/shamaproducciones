export type EventFormat = "presencial" | "online" | "hibrido";
export type EventCategory = "conferencia" | "concierto" | "taller" | "seminario" | "masterclass" | "teatro";

export interface TicketTier {
  id: string;
  name: string;
  description: string;
  priceUsd: number;
  capacity: number;
  sold: number;
  perks: string[];
  isAvailable: boolean;
}

export interface EventScheduleItem {
  time: string;
  title: string;
  speaker: string;
}

export interface EventSpeaker {
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
}

export interface ShamaEvent {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: EventCategory;
  format: EventFormat;
  date: string;
  isoDate?: string; // YYYY-MM-DD for date filtering
  time: string;
  duration: string;
  location: string;
  address?: string;
  city: string;
  bannerUrl: string;
  description: string;
  organizer: string;
  speakers: EventSpeaker[];
  tiers: TicketTier[];
  schedule: EventScheduleItem[];
  isFeatured?: boolean;
}

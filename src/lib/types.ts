export type EventFormat = "presencial" | "online" | "hibrido";
export type EventCategory = "conferencia" | "taller" | "seminario" | "masterclass";

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

export type PaymentMethod = "pago_movil" | "transferencia" | "binance_pay" | "usdt";

export type PaymentStatus = "pendiente_verificacion" | "aprobado" | "rechazado";

export interface AttendeeData {
  fullName: string;
  idCard: string; // Cédula o Pasaporte
  email: string;
  phone: string; // WhatsApp
  company?: string;
}

export interface TicketPurchase {
  orderId: string;
  ticketId: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventFormat: EventFormat;
  tierId: string;
  tierName: string;
  quantity: number;
  priceUsd: number;
  totalUsd: number;
  bcvRate: number;
  totalBs: number;
  attendee: AttendeeData;
  paymentMethod: PaymentMethod;
  paymentDetails: {
    reference: string;
    originBank?: string;
    senderPhone?: string;
    cryptoTxId?: string;
    createdAt: string;
  };
  paymentStatus: PaymentStatus;
  qrPayload: string;
  qrSignature: string;
  checkedIn: boolean;
  checkedInAt?: string;
  createdAt: string;
}

export interface PaymentBankDetails {
  bankName: string;
  accountNumber: string;
  accountType: string;
  accountHolder: string;
  idCard: string;
  phone: string;
}

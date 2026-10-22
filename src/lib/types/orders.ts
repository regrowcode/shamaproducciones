import { EventFormat } from "./events";

export type PaymentMethod = "pago_movil" | "transferencia" | "binance_pay" | "usdt";

export type PaymentStatus = "pendiente_verificacion" | "aprobado" | "rechazado";

export interface AttendeeData {
  fullName: string;
  idCard: string;
  email: string;
  phone: string;
  company?: string;
  userId?: string;
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

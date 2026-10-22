import { SHAMA_EVENTS } from "./data";
import { ShamaEvent, TicketPurchase, PaymentStatus } from "./types";
import { createQRPayload, generateTicketSignature } from "./crypto";
import { DEFAULT_BCV_RATE } from "./bcv";

const STORAGE_KEY = "shama_producciones_tickets_v1";

const INITIAL_PURCHASES: TicketPurchase[] = [
  {
    orderId: "ORD-89421",
    ticketId: "TKT-SHAMA-001",
    eventId: "evt-001",
    eventTitle: "Congreso Internacional de Producción Audiovisual & Cine 2026",
    eventDate: "15 de Noviembre, 2026",
    eventTime: "09:00 AM - 06:30 PM",
    eventLocation: "Hotel Eurobuilding & Suites (Caracas)",
    eventFormat: "presencial",
    tierId: "tier-vip-1",
    tierName: "Pase VIP & Networking",
    quantity: 1,
    priceUsd: 80,
    totalUsd: 80,
    bcvRate: DEFAULT_BCV_RATE,
    totalBs: 80 * DEFAULT_BCV_RATE,
    attendee: {
      fullName: "Alejandro Morales",
      idCard: "V-18452910",
      email: "alejandro.cine@gmail.com",
      phone: "0414-9876543",
      company: "Cinematografía Alpha",
    },
    paymentMethod: "pago_movil",
    paymentDetails: {
      reference: "849201",
      originBank: "Banco Mercantil (0105)",
      senderPhone: "0414-9876543",
      createdAt: "2026-10-22T08:30:00Z",
    },
    paymentStatus: "aprobado",
    qrPayload: createQRPayload("TKT-SHAMA-001", "evt-001", "V-18452910"),
    qrSignature: generateTicketSignature("TKT-SHAMA-001", "evt-001", "V-18452910"),
    checkedIn: false,
    createdAt: "2026-10-22T08:30:00Z",
  },
  {
    orderId: "ORD-89422",
    ticketId: "TKT-SHAMA-002",
    eventId: "evt-003",
    eventTitle: "Seminario Online: Distribución y Monetización de Contenidos 4K/HDR",
    eventDate: "05 de Diciembre, 2026",
    eventTime: "03:00 PM - 07:00 PM",
    eventLocation: "Streaming HD Shama Live (Online)",
    eventFormat: "online",
    tierId: "tier-stream-plus",
    tierName: "Pase Online Total (Live + Grabación On-Demand)",
    quantity: 1,
    priceUsd: 30,
    totalUsd: 30,
    bcvRate: DEFAULT_BCV_RATE,
    totalBs: 30 * DEFAULT_BCV_RATE,
    attendee: {
      fullName: "Gabriela Suárez",
      idCard: "V-22104928",
      email: "gabi.suarez@outlook.com",
      phone: "0424-5551234",
    },
    paymentMethod: "binance_pay",
    paymentDetails: {
      reference: "BP-93028109",
      cryptoTxId: "0x4f128c93...a8f2",
      createdAt: "2026-10-22T09:15:00Z",
    },
    paymentStatus: "pendiente_verificacion",
    qrPayload: createQRPayload("TKT-SHAMA-002", "evt-003", "V-22104928"),
    qrSignature: generateTicketSignature("TKT-SHAMA-002", "evt-003", "V-22104928"),
    checkedIn: false,
    createdAt: "2026-10-22T09:15:00Z",
  },
];

export function getEvents(): ShamaEvent[] {
  return SHAMA_EVENTS;
}

export function getEventBySlug(slug: string): ShamaEvent | undefined {
  return SHAMA_EVENTS.find((e) => e.slug === slug);
}

export function getEventById(id: string): ShamaEvent | undefined {
  return SHAMA_EVENTS.find((e) => e.id === id);
}

export function getStoredPurchases(): TicketPurchase[] {
  if (typeof window === "undefined") {
    return INITIAL_PURCHASES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PURCHASES));
      return INITIAL_PURCHASES;
    }
    return JSON.parse(raw) as TicketPurchase[];
  } catch {
    return INITIAL_PURCHASES;
  }
}

export function savePurchase(purchase: TicketPurchase): void {
  if (typeof window === "undefined") return;
  const list = getStoredPurchases();
  const filtered = list.filter((p) => p.ticketId !== purchase.ticketId);
  const updated = [purchase, ...filtered];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getTicketById(ticketId: string): TicketPurchase | undefined {
  const list = getStoredPurchases();
  return list.find((t) => t.ticketId.toUpperCase() === ticketId.trim().toUpperCase());
}

export function updateTicketPaymentStatus(ticketId: string, status: PaymentStatus): TicketPurchase | null {
  const list = getStoredPurchases();
  const index = list.findIndex((t) => t.ticketId.toUpperCase() === ticketId.toUpperCase());
  if (index === -1) return null;
  list[index].paymentStatus = status;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
  return list[index];
}

export function checkInAttendeeTicket(ticketId: string): { success: boolean; message: string; ticket?: TicketPurchase } {
  const list = getStoredPurchases();
  const index = list.findIndex((t) => t.ticketId.toUpperCase() === ticketId.toUpperCase());
  if (index === -1) {
    return { success: false, message: "Boleto no encontrado en el sistema." };
  }

  const ticket = list[index];
  if (ticket.paymentStatus !== "aprobado") {
    return {
      success: false,
      message: `El boleto no está aprobado (Estado: ${ticket.paymentStatus.replace("_", " ").toUpperCase()}). No puede ingresar.`,
      ticket,
    };
  }

  if (ticket.checkedIn) {
    return {
      success: false,
      message: `¡ATENCIÓN! Este boleto YA FUE USADO a las ${new Date(ticket.checkedInAt || "").toLocaleTimeString("es-VE")}. Posible intento de duplicación.`,
      ticket,
    };
  }

  ticket.checkedIn = true;
  ticket.checkedInAt = new Date().toISOString();
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  return {
    success: true,
    message: `¡ACCESO CONCEDIDO! Bienvenido(a) ${ticket.attendee.fullName}. Pase: ${ticket.tierName}`,
    ticket,
  };
}

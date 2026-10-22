import { TicketPurchase, PaymentStatus } from "../types/orders";
import { getStoredPurchases, savePurchase, updateTicketPaymentStatus, checkInAttendeeTicket } from "../store";

export function getAllTickets(): TicketPurchase[] {
  return getStoredPurchases();
}

export function getTicket(ticketId: string): TicketPurchase | undefined {
  const all = getStoredPurchases();
  return all.find((t) => t.ticketId.toUpperCase() === ticketId.trim().toUpperCase());
}

/**
 * Returns all tickets purchased by a specific attendee (by email or user ID)
 */
export function getCustomerTickets(userEmailOrId: string): TicketPurchase[] {
  const all = getStoredPurchases();
  const q = userEmailOrId.trim().toLowerCase();
  return all.filter(
    (t) =>
      t.attendee.email.toLowerCase() === q ||
      (t.attendee.userId && t.attendee.userId.toLowerCase() === q)
  );
}

export function updateStatus(ticketId: string, status: PaymentStatus): TicketPurchase | null {
  return updateTicketPaymentStatus(ticketId, status);
}

export function validateAndCheckIn(ticketId: string) {
  return checkInAttendeeTicket(ticketId);
}

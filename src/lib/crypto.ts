/**
 * Anti-counterfeiting token & signature generator for tickets.
 * Creates verifiable payloads for QR codes used by the door scanner.
 */

const SECRET_SALT = "shama-producciones-secure-ticket-key-2026";

/**
 * Generate a simple deterministic verification signature for a ticket
 */
export function generateTicketSignature(ticketId: string, eventId: string, idCard: string): string {
  const payload = `${ticketId}:${eventId}:${idCard}:${SECRET_SALT}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `SHAMA-${hex.toUpperCase()}`;
}

export interface QRPayloadData {
  t: string; // ticketId
  e: string; // eventId
  c: string; // idCard
  s: string; // signature
  v: number; // version
}

export function createQRPayload(ticketId: string, eventId: string, idCard: string): string {
  const sig = generateTicketSignature(ticketId, eventId, idCard);
  const data: QRPayloadData = {
    t: ticketId,
    e: eventId,
    c: idCard,
    s: sig,
    v: 1,
  };
  return JSON.stringify(data);
}

export function verifyTicketPayload(rawPayload: string): {
  isValid: boolean;
  ticketId?: string;
  eventId?: string;
  idCard?: string;
  error?: string;
} {
  try {
    const parsed = JSON.parse(rawPayload) as QRPayloadData;
    if (!parsed.t || !parsed.e || !parsed.c || !parsed.s) {
      return { isValid: false, error: "Formato de código QR inválido" };
    }

    const expectedSig = generateTicketSignature(parsed.t, parsed.e, parsed.c);
    if (parsed.s !== expectedSig) {
      return { isValid: false, error: "Firma criptográfica inválida. ¡Boleto falso o adulterado!" };
    }

    return {
      isValid: true,
      ticketId: parsed.t,
      eventId: parsed.e,
      idCard: parsed.c,
    };
  } catch {
    return { isValid: false, error: "No se pudo descifrar el código QR" };
  }
}

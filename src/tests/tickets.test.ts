import { describe, it, expect } from "vitest";
import { generateTicketSignature, createQRPayload, verifyTicketPayload } from "../lib/crypto";

describe("Ticket Cryptographic Anti-Fraud Engine", () => {
  const ticketId = "TKT-SHAMA-001";
  const eventId = "evt-001";
  const idCard = "V-18452910";

  it("generates deterministic signature for valid parameters", () => {
    const sig1 = generateTicketSignature(ticketId, eventId, idCard);
    const sig2 = generateTicketSignature(ticketId, eventId, idCard);
    expect(sig1).toBe(sig2);
    expect(sig1).toMatch(/^SHAMA-[0-9A-F]{8}$/);
  });

  it("generates distinct signatures for different tickets or IDs", () => {
    const sig1 = generateTicketSignature(ticketId, eventId, idCard);
    const sig2 = generateTicketSignature("TKT-SHAMA-002", eventId, idCard);
    const sig3 = generateTicketSignature(ticketId, eventId, "V-99999999");
    expect(sig1).not.toBe(sig2);
    expect(sig1).not.toBe(sig3);
  });

  it("creates and successfully verifies valid QR payload", () => {
    const payload = createQRPayload(ticketId, eventId, idCard);
    const result = verifyTicketPayload(payload);

    expect(result.isValid).toBe(true);
    expect(result.ticketId).toBe(ticketId);
    expect(result.eventId).toBe(eventId);
    expect(result.idCard).toBe(idCard);
    expect(result.error).toBeUndefined();
  });

  it("detects and rejects tampered QR payloads (counterfeit prevention)", () => {
    const payload = createQRPayload(ticketId, eventId, idCard);
    const parsed = JSON.parse(payload);

    // Tamper with attendee ID
    parsed.c = "V-00000000";
    const tamperedPayload = JSON.stringify(parsed);

    const result = verifyTicketPayload(tamperedPayload);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("Firma criptográfica inválida");
  });

  it("rejects malformed or unparseable QR payloads", () => {
    const result = verifyTicketPayload("invalid-qr-string-non-json");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("No se pudo descifrar el código QR");
  });
});

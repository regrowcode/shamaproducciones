import { NextRequest, NextResponse } from "next/server";
import { verifyTicketPayload } from "@/lib/crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { qrPayload } = body;

    if (!qrPayload) {
      return NextResponse.json({ error: "qrPayload es requerido" }, { status: 400 });
    }

    const verification = verifyTicketPayload(qrPayload);

    if (!verification.isValid) {
      return NextResponse.json(
        {
          valid: false,
          error: verification.error || "Firma criptográfica inválida",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      valid: true,
      ticketId: verification.ticketId,
      eventId: verification.eventId,
      idCard: verification.idCard,
      verifiedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

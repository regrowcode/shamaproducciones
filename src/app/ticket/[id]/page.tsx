"use client";

import React, { use, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Clock4,
  Download,
  Share2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Video,
  ExternalLink,
  Printer,
  Copy,
  Check,
} from "lucide-react";
import { getTicketById } from "@/lib/store";
import { TicketPurchase } from "@/lib/types";
import { formatBs, formatUsd } from "@/lib/bcv";
import TicketQRCode from "@/components/TicketQRCode";

interface PageProps {
  params: Promise<{ id: string }>;
}

function TicketContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const [ticket, setTicket] = useState<TicketPurchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const found = getTicketById(resolvedParams.id);
    if (found) {
      setTicket(found);
    }
    setLoading(false);
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        Cargando boleto digital...
      </div>
    );
  }

  if (!ticket) {
    notFound();
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div style={{ padding: "40px 0 80px" }}>
      <div className="container">
        {/* Navigation back */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <Link
            href="/eventos"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "0.9rem" }}
          >
            <ArrowLeft size={16} /> Volver a eventos
          </Link>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={handleCopyLink} className="btn btn-secondary btn-sm" id="btn-share-ticket">
              {copiedLink ? <Check size={14} color="var(--status-success)" /> : <Share2 size={14} />}
              {copiedLink ? "¡Enlace Copiado!" : "Compartir Boleto"}
            </button>
            <button type="button" onClick={handlePrint} className="btn btn-primary btn-sm" id="btn-print-ticket">
              <Printer size={14} /> Imprimir / Guardar PDF
            </button>
          </div>
        </div>

        {/* Status notification banner */}
        {ticket.paymentStatus === "pendiente_verificacion" ? (
          <div
            className="glass-panel"
            style={{
              padding: "16px 20px",
              marginBottom: "30px",
              border: "1px solid var(--status-warning)",
              background: "var(--status-warning-bg)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <Clock4 size={24} color="var(--status-warning)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: "0.92rem" }}>
              <strong>Pago Registrado - Pendiente de Verificación Bancaria:</strong> Tu boleto ya está reservado.
              Nuestro equipo administrativo está validando la referencia <strong>{ticket.paymentDetails.reference}</strong>.
              Tu código QR ya está generado y se habilitará automáticamente para el ingreso.
            </div>
          </div>
        ) : (
          <div
            className="glass-panel"
            style={{
              padding: "16px 20px",
              marginBottom: "30px",
              border: "1px solid var(--status-success)",
              background: "var(--status-success-bg)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <CheckCircle2 size={24} color="var(--status-success)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: "0.92rem" }}>
              <strong>¡Boleto Aprobado y Confirmado!</strong> El pago ha sido verificado satisfactoriamente. Presenta este código QR en la entrada del evento.
            </div>
          </div>
        )}

        {/* ================= PHYSICAL / DIGITAL TICKET PASS ================= */}
        <div className="ticket-wrapper" id="printable-ticket">
          {/* Header */}
          <div className="ticket-header">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <span className="badge badge-gold" style={{ marginBottom: "6px" }}>
                  Boleto Oficial Shama
                </span>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff", lineHeight: "1.2" }}>
                  {ticket.eventTitle}
                </h2>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>ID de Boleto</span>
                <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--accent-gold)", fontFamily: "monospace" }}>
                  {ticket.ticketId}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Calendar size={14} color="var(--accent-gold)" /> {ticket.eventDate}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Clock size={14} color="var(--accent-gold)" /> {ticket.eventTime}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={14} color="var(--accent-gold)" /> {ticket.eventLocation}
              </span>
            </div>

            {/* Circular notches */}
            <div className="ticket-notch-left" />
            <div className="ticket-notch-right" />
          </div>

          {/* Ticket Body: Details on left, QR on right */}
          <div className="ticket-body">
            <div>
              {/* Attendee Details */}
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Titular del Pase
                </span>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff" }}>
                  {ticket.attendee.fullName}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  C.I: <strong>{ticket.attendee.idCard}</strong> • {ticket.attendee.phone}
                </div>
              </div>

              {/* Tier & Price */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                <div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Categoría
                  </span>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent-gold)" }}>
                    {ticket.tierName}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Monto Pagado
                  </span>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#ffffff" }}>
                    {formatUsd(ticket.totalUsd)}{" "}
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      ({formatBs(ticket.totalBs)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", background: "rgba(0,0,0,0.25)", padding: "10px 14px", borderRadius: "var(--radius-sm)" }}>
                <div>Método: <strong style={{ color: "var(--text-secondary)", textTransform: "capitalize" }}>{ticket.paymentMethod.replace("_", " ")}</strong></div>
                <div>Referencia: <strong style={{ color: "var(--text-secondary)" }}>{ticket.paymentDetails.reference}</strong></div>
                <div>Firma Criptográfica: <strong style={{ color: "var(--accent-gold)", fontFamily: "monospace" }}>{ticket.qrSignature}</strong></div>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="qr-box">
              <TicketQRCode payload={ticket.qrPayload} size={150} />
              <div style={{ textAlign: "center", marginTop: "8px" }}>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: ticket.checkedIn ? "#fee2e2" : "#dcfce7",
                    color: ticket.checkedIn ? "#b91c1c" : "#15803d",
                  }}
                >
                  {ticket.checkedIn ? "YA CANJEADO" : "VÁLIDO PARA ENTRADA"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* If Online Event: Streaming Access Card */}
        {ticket.eventFormat === "online" && (
          <div
            className="glass-panel"
            style={{
              maxWidth: "650px",
              margin: "30px auto 0",
              padding: "24px",
              border: "1px solid var(--accent-cyan)",
              background: "rgba(6, 182, 212, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <Video size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Acceso a la Transmisión Streaming HD</h3>
            </div>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Este evento es 100% online. Tu enlace de acceso individual e intransferible estará disponible 15 minutos antes del inicio del evento.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ borderColor: "var(--accent-cyan)", color: "var(--accent-cyan)" }}
              onClick={() => alert(`Enlace personal generado para ${ticket.attendee.email}: https://live.shamaproducciones.com/stream?t=${ticket.ticketId}`)}
            >
              <ExternalLink size={14} /> Abrir Sala Virtual de Shama Live
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TicketPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
          Cargando boleto digital...
        </div>
      }
    >
      <TicketContent {...props} />
    </Suspense>
  );
}


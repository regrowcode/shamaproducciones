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
  ArrowLeft,
  Printer,
  Share2,
  Check,
  Video,
  ExternalLink,
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
      <div className="container" style={{ padding: "80px 0", textAlign: "center", color: "var(--text-secondary)" }}>
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
        {/* Navigation & Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <Link
            href="/mis-boletos"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "0.88rem" }}
          >
            <ArrowLeft size={16} /> Ver todos mis boletos
          </Link>

          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" onClick={handleCopyLink} className="btn btn-secondary btn-sm" id="btn-share-ticket">
              {copiedLink ? <Check size={14} color="#16a34a" /> : <Share2 size={14} />}
              {copiedLink ? "¡Copiado!" : "Compartir Enlace"}
            </button>
            <button type="button" onClick={handlePrint} className="btn btn-primary btn-sm" id="btn-print-ticket">
              <Printer size={14} /> Imprimir / Guardar PDF
            </button>
          </div>
        </div>

        {/* Status notification banner */}
        {ticket.paymentStatus === "pendiente_verificacion" ? (
          <div
            style={{
              padding: "16px 20px",
              marginBottom: "24px",
              border: "1px solid #fde68a",
              background: "#fffbeb",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Clock4 size={22} color="#d97706" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: "0.88rem", color: "#92400e" }}>
              <strong>Pago Registrado - Pendiente de Verificación Bancaria:</strong> Tu cupo está reservado con la referencia <strong>{ticket.paymentDetails.reference}</strong>. El boleto se habilitará para ingreso una vez conciliado.
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: "16px 20px",
              marginBottom: "24px",
              border: "1px solid #bbf7d0",
              background: "#f0fdf4",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <CheckCircle2 size={22} color="#16a34a" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: "0.88rem", color: "#166534" }}>
              <strong>¡Boleto Aprobado y Confirmado!</strong> El pago ha sido verificado satisfactoriamente. Presenta este código QR en la entrada del evento.
            </div>
          </div>
        )}

        {/* Clean Ticket Pass Card (Ticketmaster / La Tiquetera Style) */}
        <div className="ticket-clean-pass" id="printable-ticket">
          {/* Header */}
          <div style={{ padding: "28px", borderBottom: "2px dashed var(--border-subtle)", background: "#ffffff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <span className="badge badge-online" style={{ marginBottom: "6px" }}>
                  Boleto Oficial Shama
                </span>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: "1.25" }}>
                  {ticket.eventTitle}
                </h2>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>ID de Boleto</span>
                <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "var(--primary-blue)", fontFamily: "monospace" }}>
                  {ticket.ticketId}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Calendar size={14} color="var(--primary-blue)" /> {ticket.eventDate}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Clock size={14} color="var(--primary-blue)" /> {ticket.eventTime}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <MapPin size={14} color="var(--primary-blue)" /> {ticket.eventLocation}
              </span>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "28px", display: "grid", gridTemplateColumns: "1fr 180px", gap: "24px", alignItems: "center", background: "#f8fafc" }}>
            <div>
              {/* Attendee */}
              <div style={{ marginBottom: "16px" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Titular del Pase
                </span>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {ticket.attendee.fullName}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  C.I: <strong>{ticket.attendee.idCard}</strong> • {ticket.attendee.phone}
                </div>
              </div>

              {/* Tier & Price */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Categoría</span>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--primary-blue)" }}>
                    {ticket.tierName}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Monto</span>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {formatUsd(ticket.totalUsd)} <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>({formatBs(ticket.totalBs)})</span>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "#ffffff", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border-subtle)" }}>
                <div>Método: <strong style={{ color: "var(--text-secondary)", textTransform: "capitalize" }}>{ticket.paymentMethod.replace("_", " ")}</strong></div>
                <div>Referencia: <strong style={{ color: "var(--text-secondary)" }}>{ticket.paymentDetails.reference}</strong></div>
                <div>Firma: <strong style={{ color: "var(--primary-blue)", fontFamily: "monospace" }}>{ticket.qrSignature}</strong></div>
              </div>
            </div>

            {/* QR Code Container */}
            <div style={{ background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <TicketQRCode payload={ticket.qrPayload} size={140} />
              <div style={{ marginTop: "8px" }}>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: ticket.checkedIn ? "#fee2e2" : "#dcfce7",
                    color: ticket.checkedIn ? "#b91c1c" : "#15803d",
                  }}
                >
                  {ticket.checkedIn ? "YA CANJEADO" : "VÁLIDO EN PUERTA"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Online Streaming Access Card */}
        {ticket.eventFormat === "online" && (
          <div
            className="clean-event-card"
            style={{
              maxWidth: "640px",
              margin: "24px auto 0",
              padding: "20px 24px",
              borderLeft: "4px solid var(--primary-blue)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <Video size={18} color="var(--primary-blue)" />
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Acceso a Transmisión Online HD</h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
              Tu enlace de acceso individual e intransferible se habilitará 15 minutos antes del inicio del seminario.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
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
        <div className="container" style={{ padding: "80px 0", textAlign: "center", color: "var(--text-secondary)" }}>
          Cargando boleto digital...
        </div>
      }
    >
      <TicketContent {...props} />
    </Suspense>
  );
}

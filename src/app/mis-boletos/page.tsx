"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Clock4,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
  User,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { getCustomerTickets } from "@/lib/services/ticket-service";
import { TicketPurchase } from "@/lib/types/orders";
import { formatBs, formatUsd } from "@/lib/bcv";
import TicketQRCode from "@/components/TicketQRCode";

export default function MisBoletosPage() {
  const { user, isLoading } = useAuth();
  const [tickets, setTickets] = useState<TicketPurchase[]>([]);

  useEffect(() => {
    if (user) {
      const myTickets = getCustomerTickets(user.email);
      setTickets(myTickets);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center", color: "var(--text-secondary)" }}>
        Cargando tus boletos...
      </div>
    );
  }

  // Not logged in view
  if (!user) {
    return (
      <div className="container" style={{ padding: "80px 20px", maxWidth: "600px", textAlign: "center" }}>
        <div className="auth-clean-card" style={{ margin: "0 auto" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "var(--primary-blue-light)",
              color: "var(--primary-blue)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Ticket size={28} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px" }}>
            Consulta de Boletos
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "24px" }}>
            Inicia sesión con tu correo electrónico para visualizar todos tus boletos digitales y pases de acceso con código QR.
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <Link href="/login" className="btn btn-primary">
              Iniciar Sesión
            </Link>
            <Link href="/registro" className="btn btn-secondary">
              Crear Cuenta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 0 80px" }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.88rem", color: "var(--primary-blue)", fontWeight: 700, marginBottom: "4px" }}>
              <User size={16} /> Portal del Asistente
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>
              Mis Boletos Digitales
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Hola, <strong>{user.fullName}</strong> ({user.idCard}). Aquí tienes tus entradas activas.
            </p>
          </div>

          <Link href="/eventos" className="btn btn-primary btn-sm">
            <Ticket size={16} /> Explorar Más Eventos
          </Link>
        </div>

        {/* Tickets List */}
        {tickets.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {tickets.map((t) => (
              <div
                key={t.ticketId}
                className="clean-event-card"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 200px",
                  padding: "24px",
                  alignItems: "center",
                  gap: "24px",
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "0.8rem", background: "var(--bg-surface-subtle)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                      {t.ticketId}
                    </span>
                    {t.paymentStatus === "aprobado" ? (
                      <span className="badge badge-presencial">
                        <CheckCircle2 size={12} /> Pago Aprobado
                      </span>
                    ) : (
                      <span className="badge badge-gold">
                        <Clock4 size={12} /> Verificación Pendiente
                      </span>
                    )}
                    <span className="badge badge-online">{t.tierName}</span>
                  </div>

                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
                    {t.eventTitle}
                  </h3>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={14} color="var(--primary-blue)" /> {t.eventDate}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={14} color="var(--primary-blue)" /> {t.eventTime}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={14} color="var(--primary-blue)" /> {t.eventLocation}
                    </span>
                  </div>

                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Total Pagado: <strong style={{ color: "var(--text-primary)" }}>{formatUsd(t.totalUsd)}</strong> ({formatBs(t.totalBs)}) • Ref: {t.paymentDetails.reference}
                  </div>
                </div>

                {/* QR & Action */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderLeft: "1px solid var(--border-subtle)", paddingLeft: "20px" }}>
                  <div style={{ width: "120px", height: "120px", background: "#ffffff", padding: "6px", borderRadius: "8px", border: "1px solid var(--border-subtle)", marginBottom: "12px" }}>
                    <TicketQRCode payload={t.qrPayload} size={108} />
                  </div>

                  <Link href={`/ticket/${t.ticketId}`} className="btn btn-primary btn-sm" style={{ width: "100%" }}>
                    Ver Boleto <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="clean-event-card"
            style={{
              padding: "60px 20px",
              textAlign: "center",
              maxWidth: "500px",
              margin: "40px auto",
            }}
          >
            <Ticket size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "8px" }}>
              Aún no tienes boletos registrados
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "20px" }}>
              Explora nuestra cartelera de conferencias, talleres y seminarios y asegura tu entrada digital.
            </p>
            <Link href="/eventos" className="btn btn-primary btn-sm">
              Ver Cartelera de Eventos <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

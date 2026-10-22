"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  History,
  Search,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { checkInAttendeeTicket, getStoredPurchases } from "@/lib/store";
import { verifyTicketPayload } from "@/lib/crypto";
import { TicketPurchase } from "@/lib/types";

export default function ValidadorPage() {
  const [scanInput, setScanInput] = useState("");
  const [result, setResult] = useState<{
    status: "idle" | "success" | "already_used" | "error" | "pending";
    message: string;
    ticket?: TicketPurchase;
  }>({
    status: "idle",
    message: "",
  });

  const [history, setHistory] = useState<
    Array<{
      ticketId: string;
      attendeeName: string;
      tierName: string;
      time: string;
      status: "success" | "failed";
    }>
  >([]);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    const query = scanInput.trim();
    if (!query) return;

    // Check if it's a full JSON QR payload or a Ticket ID
    let targetTicketId = query;
    if (query.startsWith("{")) {
      const verified = verifyTicketPayload(query);
      if (!verified.isValid || !verified.ticketId) {
        setResult({
          status: "error",
          message: verified.error || "Código QR no válido o firma adulterada.",
        });
        return;
      }
      targetTicketId = verified.ticketId;
    }

    // Attempt to check in ticket in repository
    const checkResult = checkInAttendeeTicket(targetTicketId);

    if (checkResult.success && checkResult.ticket) {
      setResult({
        status: "success",
        message: checkResult.message,
        ticket: checkResult.ticket,
      });

      // Add to staff history
      setHistory((prev) => [
        {
          ticketId: checkResult.ticket!.ticketId,
          attendeeName: checkResult.ticket!.attendee.fullName,
          tierName: checkResult.ticket!.tierName,
          time: new Date().toLocaleTimeString("es-VE"),
          status: "success",
        },
        ...prev.slice(0, 9),
      ]);
      setScanInput("");
    } else {
      const ticket = checkResult.ticket;
      const isAlreadyUsed = checkResult.message.includes("YA FUE USADO");
      const isPending = checkResult.message.includes("no está aprobado");

      setResult({
        status: isAlreadyUsed ? "already_used" : isPending ? "pending" : "error",
        message: checkResult.message,
        ticket,
      });

      if (ticket) {
        setHistory((prev) => [
          {
            ticketId: ticket.ticketId,
            attendeeName: ticket.attendee.fullName,
            tierName: ticket.tierName,
            time: new Date().toLocaleTimeString("es-VE"),
            status: "failed",
          },
          ...prev.slice(0, 9),
        ]);
      }
    }
  };

  const handleQuickTest = (ticketId: string) => {
    setScanInput(ticketId);
  };

  const allPurchases = getStoredPurchases();

  return (
    <div style={{ padding: "40px 0 80px" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: "20px" }}>
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "0.9rem" }}
          >
            <ArrowLeft size={16} /> Volver al Inicio
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: "rgba(245, 158, 11, 0.15)",
              color: "var(--accent-gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <QrCode size={32} />
          </div>
          <span className="badge badge-gold" style={{ marginBottom: "8px" }}>
            Módulo Exclusivo Staff & Puerta
          </span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800 }}>Validador de Boletos QR</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Escanea el código QR del boleto digital o escribe el ID para verificar el acceso y prevenir duplicados.
          </p>
        </div>

        {/* Scanner Form Card */}
        <div className="glass-panel" style={{ padding: "32px", marginBottom: "32px" }}>
          <form onSubmit={handleValidate}>
            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Escanear QR o Ingresar ID de Boleto</span>
                <span style={{ color: "var(--accent-gold)", fontSize: "0.78rem" }}>Offline-Ready</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Pega el código QR o escribe: TKT-SHAMA-001..."
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  style={{ fontSize: "1.05rem", padding: "14px 16px", paddingRight: "100px" }}
                  id="scanner-input"
                  autoFocus
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)" }}
                  id="btn-validate"
                >
                  Validar
                </button>
              </div>
            </div>
          </form>

          {/* Quick buttons to test demo tickets */}
          <div style={{ marginTop: "16px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
            <span>Boletos de prueba rápidos:</span>{" "}
            {allPurchases.slice(0, 3).map((p) => (
              <button
                key={p.ticketId}
                type="button"
                onClick={() => handleQuickTest(p.ticketId)}
                style={{
                  background: "var(--bg-elevated)",
                  color: "var(--accent-gold)",
                  border: "1px solid var(--border-subtle)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "0.78rem",
                  marginRight: "6px",
                  marginTop: "6px",
                  fontFamily: "monospace",
                }}
              >
                {p.ticketId} ({p.paymentStatus === "aprobado" ? "Pagado" : "Pendiente"})
              </button>
            ))}
          </div>
        </div>

        {/* Validation Result Box */}
        {result.status !== "idle" && (
          <div
            className="card"
            style={{
              padding: "28px",
              marginBottom: "32px",
              border:
                result.status === "success"
                  ? "2px solid var(--status-success)"
                  : result.status === "already_used" || result.status === "error"
                  ? "2px solid var(--status-error)"
                  : "2px solid var(--status-warning)",
              background:
                result.status === "success"
                  ? "rgba(16, 185, 129, 0.08)"
                  : result.status === "already_used" || result.status === "error"
                  ? "rgba(239, 68, 68, 0.08)"
                  : "rgba(245, 158, 11, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              {result.status === "success" && (
                <CheckCircle2 size={36} color="var(--status-success)" style={{ flexShrink: 0 }} />
              )}
              {result.status === "already_used" && (
                <AlertTriangle size={36} color="var(--status-error)" style={{ flexShrink: 0 }} />
              )}
              {result.status === "error" && (
                <XCircle size={36} color="var(--status-error)" style={{ flexShrink: 0 }} />
              )}
              {result.status === "pending" && (
                <AlertTriangle size={36} color="var(--status-warning)" style={{ flexShrink: 0 }} />
              )}

              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 800,
                    marginBottom: "6px",
                    color:
                      result.status === "success"
                        ? "var(--status-success)"
                        : result.status === "already_used" || result.status === "error"
                        ? "var(--status-error)"
                        : "var(--status-warning)",
                  }}
                >
                  {result.status === "success" && "¡ACCESO CONCEDIDO!"}
                  {result.status === "already_used" && "¡ALERTA: BOLETO YA CANJEADO!"}
                  {result.status === "error" && "¡BOLETO NO VÁLIDO!"}
                  {result.status === "pending" && "PAGO PENDIENTE DE REVISIÓN"}
                </h3>
                <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "14px" }}>
                  {result.message}
                </p>

                {result.ticket && (
                  <div
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      padding: "16px",
                      borderRadius: "var(--radius-sm)",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                      fontSize: "0.85rem",
                    }}
                  >
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Asistente:</span>
                      <div style={{ fontWeight: 700 }}>{result.ticket.attendee.fullName}</div>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Cédula:</span>
                      <div style={{ fontWeight: 700 }}>{result.ticket.attendee.idCard}</div>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Categoría:</span>
                      <div style={{ fontWeight: 700, color: "var(--accent-gold)" }}>{result.ticket.tierName}</div>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Evento:</span>
                      <div style={{ fontWeight: 700 }}>{result.ticket.eventTitle}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Scan History */}
        {history.length > 0 && (
          <div className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <History size={18} color="var(--accent-gold)" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Historial de Escaneos en Esta Sesión</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {history.map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "var(--bg-elevated)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.85rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {h.status === "success" ? (
                      <CheckCircle2 size={16} color="var(--status-success)" />
                    ) : (
                      <XCircle size={16} color="var(--status-error)" />
                    )}
                    <div>
                      <strong>{h.attendeeName}</strong> ({h.tierName})
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                    <span style={{ fontFamily: "monospace" }}>{h.ticketId}</span>
                    <span>{h.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

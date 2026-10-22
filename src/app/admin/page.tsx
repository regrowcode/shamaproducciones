"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock4,
  DollarSign,
  Ticket,
  Users,
  Search,
  ExternalLink,
  Download,
  LogOut,
  QrCode,
  Check,
  AlertTriangle,
  History,
  Lock,
} from "lucide-react";
import { getCurrentAdmin, logoutAdmin } from "@/lib/services/auth-service";
import { getStoredPurchases, updateTicketPaymentStatus, checkInAttendeeTicket } from "@/lib/store";
import { verifyTicketPayload } from "@/lib/crypto";
import { TicketPurchase, PaymentStatus } from "@/lib/types/orders";
import { DEFAULT_BCV_RATE, formatBs, formatUsd } from "@/lib/bcv";
import { User } from "@/lib/types/auth";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"ordenes" | "validador">("ordenes");

  // Orders state
  const [purchases, setPurchases] = useState<TicketPurchase[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Scanner state
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState<{
    status: "idle" | "success" | "already_used" | "error" | "pending";
    message: string;
    ticket?: TicketPurchase;
  }>({ status: "idle", message: "" });

  const [scanHistory, setScanHistory] = useState<
    Array<{
      ticketId: string;
      attendeeName: string;
      tierName: string;
      time: string;
      status: "success" | "failed";
    }>
  >([]);

  // Auth gatekeeper
  useEffect(() => {
    const current = getCurrentAdmin();
    if (!current) {
      router.push("/admin/login");
    } else {
      setAdmin(current);
    }
  }, [router]);

  useEffect(() => {
    setPurchases(getStoredPurchases());
  }, [refreshKey]);

  if (!admin) {
    return (
      <div style={{ padding: "80px 0", textAlign: "center", color: "#64748b" }}>
        Verificando credenciales de acceso...
      </div>
    );
  }

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  const handleUpdateStatus = (ticketId: string, newStatus: PaymentStatus) => {
    updateTicketPaymentStatus(ticketId, newStatus);
    setRefreshKey((k) => k + 1);
  };

  const handleValidateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const query = scanInput.trim();
    if (!query) return;

    let targetTicketId = query;
    if (query.startsWith("{")) {
      const verified = verifyTicketPayload(query);
      if (!verified.isValid || !verified.ticketId) {
        setScanResult({
          status: "error",
          message: verified.error || "Firma criptográfica no coincide. Boleto adulterado.",
        });
        return;
      }
      targetTicketId = verified.ticketId;
    }

    const checkResult = checkInAttendeeTicket(targetTicketId);

    if (checkResult.success && checkResult.ticket) {
      setScanResult({
        status: "success",
        message: checkResult.message,
        ticket: checkResult.ticket,
      });

      setScanHistory((prev) => [
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
      setRefreshKey((k) => k + 1);
    } else {
      const isAlreadyUsed = checkResult.message.includes("YA FUE USADO");
      const isPending = checkResult.message.includes("no está aprobado");

      setScanResult({
        status: isAlreadyUsed ? "already_used" : isPending ? "pending" : "error",
        message: checkResult.message,
        ticket: checkResult.ticket,
      });
    }
  };

  const filteredPurchases = purchases.filter((p) => {
    const matchStatus = filterStatus === "todos" || p.paymentStatus === filterStatus;
    const matchSearch =
      p.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.attendee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.attendee.idCard.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.paymentDetails.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalTickets = purchases.reduce((acc, p) => acc + p.quantity, 0);
  const totalRevenueUsd = purchases
    .filter((p) => p.paymentStatus === "aprobado")
    .reduce((acc, p) => acc + p.totalUsd, 0);
  const totalRevenueBs = purchases
    .filter((p) => p.paymentStatus === "aprobado")
    .reduce((acc, p) => acc + p.totalBs, 0);
  const pendingCount = purchases.filter((p) => p.paymentStatus === "pendiente_verificacion").length;
  const checkedInCount = purchases.filter((p) => p.checkedIn).length;

  const handleExportCSV = () => {
    const headers = "TicketID,Nombre,Cedula,Email,Telefono,Evento,Pase,Metodo,Referencia,MontoUSD,MontoBs,Estado,CheckIn\n";
    const rows = purchases
      .map(
        (p) =>
          `"${p.ticketId}","${p.attendee.fullName}","${p.attendee.idCard}","${p.attendee.email}","${p.attendee.phone}","${p.eventTitle}","${p.tierName}","${p.paymentMethod}","${p.paymentDetails.reference}",${p.totalUsd},${p.totalBs},"${p.paymentStatus}","${p.checkedIn ? "SI" : "NO"}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `asistentes_shama_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Admin Top Banner */}
      <div style={{ background: "#0f172a", color: "#ffffff", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: "var(--primary-blue)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 800 }}>
              SHAMA BACKOFFICE
            </div>
            <span style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
              Panel Privado de Organización
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "0.85rem" }}>
            <span>
              Usuario: <strong>{admin.fullName}</strong> ({admin.role})
            </span>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                color: "#fca5a5",
                background: "rgba(239, 68, 68, 0.15)",
                padding: "4px 10px",
                borderRadius: "4px",
                fontSize: "0.8rem",
              }}
            >
              <LogOut size={13} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "32px" }}>
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "28px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}>
          <button
            type="button"
            onClick={() => setActiveTab("ordenes")}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.92rem",
              background: activeTab === "ordenes" ? "var(--primary-blue)" : "#ffffff",
              color: activeTab === "ordenes" ? "#ffffff" : "var(--text-secondary)",
              border: activeTab === "ordenes" ? "none" : "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            Ventas y Conciliación de Pagos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("validador")}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.92rem",
              background: activeTab === "validador" ? "var(--primary-blue)" : "#ffffff",
              color: activeTab === "validador" ? "#ffffff" : "var(--text-secondary)",
              border: activeTab === "validador" ? "none" : "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <QrCode size={16} /> Validador de Puerta (Staff)
          </button>
        </div>

        {/* TAB 1: ORDERS & PAYMENTS */}
        {activeTab === "ordenes" && (
          <div>
            {/* Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
              <div className="clean-event-card" style={{ padding: "20px" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>Recaudación Aprobada</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px" }}>
                  {formatUsd(totalRevenueUsd)}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--accent-gold)", fontWeight: 600 }}>
                  {formatBs(totalRevenueBs)}
                </div>
              </div>

              <div className="clean-event-card" style={{ padding: "20px", borderLeft: "4px solid var(--accent-gold)" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>Pagos por Conciliar</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: pendingCount > 0 ? "var(--accent-gold)" : "var(--text-primary)", marginTop: "4px" }}>
                  {pendingCount}
                </div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Requieren aprobación</span>
              </div>

              <div className="clean-event-card" style={{ padding: "20px" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>Total Boletos Emitidos</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px" }}>
                  {totalTickets}
                </div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Todas las categorías</span>
              </div>

              <div className="clean-event-card" style={{ padding: "20px" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>Ingresados a Sala</span>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--accent-emerald)", marginTop: "4px" }}>
                  {checkedInCount}
                </div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Check-in en entrada</span>
              </div>
            </div>

            {/* Filter Bar */}
            <div
              style={{
                background: "#ffffff",
                padding: "16px 20px",
                borderRadius: "12px",
                border: "1px solid var(--border-subtle)",
                marginBottom: "20px",
                display: "flex",
                flexWrap: "wrap",
                gap: "14px",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div style={{ position: "relative", flex: "1 1 300px" }}>
                <Search size={16} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  placeholder="Buscar por ID, nombre, cédula o referencia..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: "36px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-select"
                  style={{ width: "auto" }}
                >
                  <option value="todos">Todos los estados</option>
                  <option value="pendiente_verificacion">Pendientes de Pago</option>
                  <option value="aprobado">Aprobados</option>
                  <option value="rechazado">Rechazados</option>
                </select>

                <button type="button" onClick={handleExportCSV} className="btn btn-secondary btn-sm">
                  <Download size={14} /> Exportar CSV
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid var(--border-subtle)", overflowX: "auto", boxShadow: "var(--shadow-sm)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                    <th style={{ padding: "12px 16px" }}>Boleto / Orden</th>
                    <th style={{ padding: "12px 16px" }}>Asistente</th>
                    <th style={{ padding: "12px 16px" }}>Evento / Pase</th>
                    <th style={{ padding: "12px 16px" }}>Pago / Referencia</th>
                    <th style={{ padding: "12px 16px" }}>Monto</th>
                    <th style={{ padding: "12px 16px" }}>Estado</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPurchases.map((p) => (
                    <tr key={p.ticketId} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "14px 16px", fontFamily: "monospace", fontWeight: 700 }}>
                        <Link href={`/ticket/${p.ticketId}`} target="_blank" style={{ color: "var(--primary-blue)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          {p.ticketId} <ExternalLink size={12} />
                        </Link>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{p.orderId}</div>
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 600 }}>{p.attendee.fullName}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          {p.attendee.idCard} • {p.attendee.phone}
                        </div>
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 500, maxWidth: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {p.eventTitle}
                        </div>
                        <span className="badge badge-online">{p.tierName}</span>
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        <strong style={{ textTransform: "capitalize" }}>{p.paymentMethod.replace("_", " ")}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                          Ref: <strong>{p.paymentDetails.reference}</strong>
                        </div>
                        {p.paymentDetails.originBank && (
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{p.paymentDetails.originBank}</div>
                        )}
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 700 }}>{formatUsd(p.totalUsd)}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--accent-gold)" }}>{formatBs(p.totalBs)}</div>
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        {p.paymentStatus === "aprobado" && <span className="badge badge-presencial">Aprobado</span>}
                        {p.paymentStatus === "pendiente_verificacion" && <span className="badge badge-gold">Pendiente</span>}
                        {p.paymentStatus === "rechazado" && <span className="badge" style={{ background: "#fee2e2", color: "#dc2626" }}>Rechazado</span>}
                        {p.checkedIn && <div style={{ fontSize: "0.72rem", color: "#16a34a", marginTop: "4px" }}>✓ En sala</div>}
                      </td>

                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          {p.paymentStatus !== "aprobado" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(p.ticketId, "aprobado")}
                              className="btn btn-primary btn-sm"
                              style={{ background: "#16a34a", padding: "4px 8px", fontSize: "0.78rem" }}
                            >
                              <CheckCircle2 size={13} /> Aprobar
                            </button>
                          )}
                          {p.paymentStatus !== "rechazado" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(p.ticketId, "rechazado")}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: "4px 8px", fontSize: "0.78rem", color: "#dc2626" }}
                            >
                              <XCircle size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPurchases.length === 0 && (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                  No se encontraron órdenes con los filtros seleccionados.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: STAFF QR SCANNER */}
        {activeTab === "validador" && (
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <div className="clean-event-card" style={{ padding: "32px", marginBottom: "28px" }}>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div style={{ width: "48px", height: "48px", background: "var(--primary-blue-light)", color: "var(--primary-blue)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <QrCode size={26} />
                </div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Escáner de Puerta en Tiempo Real</h2>
                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                  Pega el código QR escaneado o escribe el ID de boleto para conceder el acceso.
                </p>
              </div>

              <form onSubmit={handleValidateTicket}>
                <div className="form-group">
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Escribe: TKT-SHAMA-001 o pega el QR..."
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      style={{ fontSize: "1rem" }}
                      autoFocus
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: "0 24px" }}>
                      Validar
                    </button>
                  </div>
                </div>
              </form>

              {/* Scan result alert */}
              {scanResult.status !== "idle" && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "16px 20px",
                    borderRadius: "8px",
                    border: scanResult.status === "success" ? "1px solid #16a34a" : "1px solid #dc2626",
                    background: scanResult.status === "success" ? "#f0fdf4" : "#fef2f2",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    {scanResult.status === "success" ? (
                      <CheckCircle2 size={24} color="#16a34a" style={{ flexShrink: 0 }} />
                    ) : (
                      <AlertTriangle size={24} color="#dc2626" style={{ flexShrink: 0 }} />
                    )}
                    <div>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: scanResult.status === "success" ? "#16a34a" : "#dc2626" }}>
                        {scanResult.status === "success" ? "¡ACCESO CONCEDIDO!" : "ACCESO DENEGADO"}
                      </h4>
                      <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", marginTop: "2px" }}>
                        {scanResult.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent check-ins */}
            {scanHistory.length > 0 && (
              <div className="clean-event-card" style={{ padding: "20px" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "14px" }}>
                  Últimos accesos escaneados:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {scanHistory.map((h, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#f8fafc", borderRadius: "6px", fontSize: "0.85rem" }}>
                      <div>
                        <strong>{h.attendeeName}</strong> ({h.tierName})
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                        {h.ticketId} • {h.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

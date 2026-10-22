"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Filter,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { getStoredPurchases, updateTicketPaymentStatus } from "@/lib/store";
import { TicketPurchase, PaymentStatus } from "@/lib/types";
import { DEFAULT_BCV_RATE, formatBs, formatUsd } from "@/lib/bcv";

export default function AdminPage() {
  const [purchases, setPurchases] = useState<TicketPurchase[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setPurchases(getStoredPurchases());
  }, [refreshKey]);

  const handleUpdateStatus = (ticketId: string, newStatus: PaymentStatus) => {
    updateTicketPaymentStatus(ticketId, newStatus);
    setRefreshKey((k) => k + 1);
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

  // Calculate high-level stats
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
    <div style={{ padding: "40px 0 80px" }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "0.9rem" }}
          >
            <ArrowLeft size={16} /> Volver a la web
          </Link>

          <button type="button" onClick={handleExportCSV} className="btn btn-secondary btn-sm" id="btn-export-csv">
            <Download size={14} /> Exportar Lista de Asistentes (CSV)
          </button>
        </div>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <span className="badge badge-gold" style={{ marginBottom: "8px" }}>
            <ShieldCheck size={14} /> Panel Administrativo Shama
          </span>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800 }}>Gestión de Eventos y Conciliación de Pagos</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            Revisa transferencias bancarias, pagos móviles y depósitos en Binance Pay para aprobar los boletos de tus asistentes.
          </p>
        </div>

        {/* High Level Metrics Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "36px" }}>
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Recaudación Aprobada</span>
              <DollarSign size={20} color="var(--status-success)" />
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {formatUsd(totalRevenueUsd)}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--accent-gold)" }}>
              {formatBs(totalRevenueBs)} (BCV: {DEFAULT_BCV_RATE})
            </div>
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Pagos por Conciliar</span>
              <Clock4 size={20} color="var(--status-warning)" />
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: pendingCount > 0 ? "var(--status-warning)" : "var(--text-primary)" }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              Requieren confirmación manual
            </div>
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Total Boletos Emitidos</span>
              <Ticket size={20} color="var(--accent-cyan)" />
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {totalTickets}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              Todas las categorías
            </div>
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Asistentes Ingresados</span>
              <Users size={20} color="var(--accent-purple)" />
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {checkedInCount}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              Check-in escaneados en puerta
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div
          className="glass-panel"
          style={{
            padding: "20px 24px",
            marginBottom: "24px",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ position: "relative", flex: "1 1 300px" }}>
            <Search
              size={18}
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Buscar por ID, asistente, cédula o referencia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "42px" }}
              id="admin-search-input"
            />
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Estado:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-select"
              style={{ width: "auto" }}
              id="admin-status-select"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente_verificacion">Pendientes de Pago</option>
              <option value="aprobado">Aprobados</option>
              <option value="rechazado">Rechazados</option>
            </select>
          </div>
        </div>

        {/* Table of Orders */}
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                <th style={{ padding: "14px 18px" }}>Boleto / Orden</th>
                <th style={{ padding: "14px 18px" }}>Asistente</th>
                <th style={{ padding: "14px 18px" }}>Evento & Categoría</th>
                <th style={{ padding: "14px 18px" }}>Método / Referencia</th>
                <th style={{ padding: "14px 18px" }}>Monto</th>
                <th style={{ padding: "14px 18px" }}>Estado</th>
                <th style={{ padding: "14px 18px", textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((p) => (
                <tr
                  key={p.ticketId}
                  style={{ borderBottom: "1px solid var(--border-subtle)", transition: "background 0.2s" }}
                >
                  <td style={{ padding: "16px 18px", fontFamily: "monospace", fontWeight: 700 }}>
                    <Link
                      href={`/ticket/${p.ticketId}`}
                      target="_blank"
                      style={{ color: "var(--accent-gold)", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      {p.ticketId} <ExternalLink size={12} />
                    </Link>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{p.orderId}</div>
                  </td>

                  <td style={{ padding: "16px 18px" }}>
                    <div style={{ fontWeight: 600 }}>{p.attendee.fullName}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      C.I: {p.attendee.idCard} • {p.attendee.phone}
                    </div>
                  </td>

                  <td style={{ padding: "16px 18px" }}>
                    <div style={{ fontWeight: 500, maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.eventTitle}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--accent-gold)" }}>{p.tierName}</div>
                  </td>

                  <td style={{ padding: "16px 18px" }}>
                    <div style={{ fontWeight: 600, textTransform: "capitalize" }}>
                      {p.paymentMethod.replace("_", " ")}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                      Ref: <strong>{p.paymentDetails.reference}</strong>
                    </div>
                    {p.paymentDetails.originBank && (
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{p.paymentDetails.originBank}</div>
                    )}
                  </td>

                  <td style={{ padding: "16px 18px" }}>
                    <div style={{ fontWeight: 700 }}>{formatUsd(p.totalUsd)}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--accent-gold)" }}>{formatBs(p.totalBs)}</div>
                  </td>

                  <td style={{ padding: "16px 18px" }}>
                    {p.paymentStatus === "aprobado" && (
                      <span className="badge badge-presencial">Aprobado</span>
                    )}
                    {p.paymentStatus === "pendiente_verificacion" && (
                      <span className="badge badge-gold">Pendiente</span>
                    )}
                    {p.paymentStatus === "rechazado" && (
                      <span
                        className="badge"
                        style={{ background: "var(--status-error-bg)", color: "var(--status-error)" }}
                      >
                        Rechazado
                      </span>
                    )}
                    {p.checkedIn && (
                      <div style={{ fontSize: "0.72rem", color: "var(--status-success)", marginTop: "4px" }}>
                        ✓ En sala
                      </div>
                    )}
                  </td>

                  <td style={{ padding: "16px 18px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "6px" }}>
                      {p.paymentStatus !== "aprobado" && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{
                            borderColor: "var(--status-success)",
                            color: "var(--status-success)",
                            padding: "4px 8px",
                            fontSize: "0.78rem",
                          }}
                          onClick={() => handleUpdateStatus(p.ticketId, "aprobado")}
                          title="Aprobar pago y liberar boleto"
                        >
                          <CheckCircle2 size={14} /> Aprobar
                        </button>
                      )}
                      {p.paymentStatus !== "rechazado" && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{
                            borderColor: "var(--status-error)",
                            color: "var(--status-error)",
                            padding: "4px 8px",
                            fontSize: "0.78rem",
                          }}
                          onClick={() => handleUpdateStatus(p.ticketId, "rechazado")}
                          title="Rechazar pago"
                        >
                          <XCircle size={14} />
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
    </div>
  );
}

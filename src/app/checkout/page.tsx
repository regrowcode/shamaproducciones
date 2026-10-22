"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  Check,
  Copy,
  Smartphone,
  Building2,
  Coins,
  ArrowLeft,
  Lock,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import { SHAMA_EVENTS } from "@/lib/data";
import { PAYMENT_CONFIG } from "@/lib/payment-config";
import { savePurchase } from "@/lib/store";
import { createQRPayload, generateTicketSignature } from "@/lib/crypto";
import { DEFAULT_BCV_RATE, formatBs, formatUsd, usdToBs } from "@/lib/bcv";
import { PaymentMethod, TicketPurchase } from "@/lib/types";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const eventSlug = searchParams.get("event") || SHAMA_EVENTS[0].slug;
  const tierId = searchParams.get("tier");
  const quantity = Math.max(1, parseInt(searchParams.get("qty") || "1", 10));

  const event = SHAMA_EVENTS.find((e) => e.slug === eventSlug) || SHAMA_EVENTS[0];
  const tier = event.tiers.find((t) => t.id === tierId) || event.tiers[0];

  const bcvRate = DEFAULT_BCV_RATE;
  const totalUsd = tier.priceUsd * quantity;
  const totalBs = usdToBs(totalUsd, bcvRate);

  // Form states
  const [fullName, setFullName] = useState("");
  const [idCard, setIdCard] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pago_movil");
  const [selectedBank, setSelectedBank] = useState("mercantil");
  const [paymentReference, setPaymentReference] = useState("");
  const [originBank, setOriginBank] = useState("Mercantil");
  const [senderPhone, setSenderPhone] = useState("");
  const [cryptoTxId, setCryptoTxId] = useState("");
  const [cryptoSubtype, setCryptoSubtype] = useState<"binance" | "usdt">("binance");

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim() || !idCard.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg("Por favor completa todos los datos obligatorios del asistente.");
      return;
    }

    if (!paymentReference.trim() && !cryptoTxId.trim()) {
      setErrorMsg("Por favor introduce el número de referencia o ID de la transacción del pago realizado.");
      return;
    }

    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${Date.now().toString().slice(-5)}${randomSuffix.toString().slice(0, 2)}`;
    const ticketId = `TKT-SHAMA-${randomSuffix}`;

    const newPurchase: TicketPurchase = {
      orderId,
      ticketId,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      eventFormat: event.format,
      tierId: tier.id,
      tierName: tier.name,
      quantity,
      priceUsd: tier.priceUsd,
      totalUsd,
      bcvRate,
      totalBs,
      attendee: {
        fullName: fullName.trim(),
        idCard: idCard.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim() || undefined,
      },
      paymentMethod,
      paymentDetails: {
        reference: paymentReference.trim() || cryptoTxId.trim(),
        originBank: paymentMethod === "pago_movil" || paymentMethod === "transferencia" ? originBank : undefined,
        senderPhone: paymentMethod === "pago_movil" ? senderPhone : undefined,
        cryptoTxId: paymentMethod === "binance_pay" || paymentMethod === "usdt" ? (cryptoTxId.trim() || paymentReference.trim()) : undefined,
        createdAt: new Date().toISOString(),
      },
      paymentStatus: "pendiente_verificacion",
      qrPayload: createQRPayload(ticketId, event.id, idCard.trim()),
      qrSignature: generateTicketSignature(ticketId, event.id, idCard.trim()),
      checkedIn: false,
      createdAt: new Date().toISOString(),
    };

    savePurchase(newPurchase);

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#10b981", "#8b5cf6", "#fbbf24"],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      router.push(`/ticket/${ticketId}`);
    }, 1000);
  };

  const activeBankAccount = PAYMENT_CONFIG.bankAccounts.find((b) => b.id === selectedBank) || PAYMENT_CONFIG.bankAccounts[0];

  return (
    <div style={{ padding: "30px 0 80px" }}>
      <div className="container">
        {/* Header navigation */}
        <div style={{ marginBottom: "24px" }}>
          <Link
            href={`/eventos/${event.slug}`}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "0.9rem" }}
          >
            <ArrowLeft size={16} /> Volver a {event.title}
          </Link>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <span className="badge badge-gold" style={{ marginBottom: "8px" }}>
            <Lock size={12} /> Proceso de Pago Seguro
          </span>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800 }}>Finalizar Compra de Boletos</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            Completa tus datos de asistente y realiza el pago mediante los canales autorizados en Venezuela.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="checkout-grid">
            {/* Left Column: Form & Payment Methods */}
            <div>
              {/* Step 1: Attendee Info */}
              <div className="glass-panel" style={{ padding: "32px", marginBottom: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-gold)", color: "#080a10", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem" }}>
                    1
                  </div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Datos del Asistente (Titular del Boleto)</h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label className="form-label">Nombre Completo *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej: Carlos Silva"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      id="attendee-name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cédula de Identidad o Pasaporte *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej: V-18452910"
                      required
                      value={idCard}
                      onChange={(e) => setIdCard(e.target.value)}
                      id="attendee-idcard"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="Ej: 0414-1234567"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      id="attendee-phone"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Correo Electrónico *</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="nombre@gmail.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      id="attendee-email"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Empresa / Rol (Opcional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej: Productor Independiente"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      id="attendee-company"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method Selection */}
              <div className="glass-panel" style={{ padding: "32px", marginBottom: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-gold)", color: "#080a10", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem" }}>
                    2
                  </div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Método de Pago</h2>
                </div>

                {/* Tabs */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "24px" }}>
                  <div
                    className={`payment-tab ${paymentMethod === "pago_movil" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("pago_movil")}
                    id="tab-pago-movil"
                  >
                    <Smartphone size={22} color="var(--accent-gold)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Pago Móvil</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Instantáneo en Bs.</div>
                    </div>
                  </div>

                  <div
                    className={`payment-tab ${paymentMethod === "transferencia" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("transferencia")}
                    id="tab-transferencia"
                  >
                    <Building2 size={22} color="var(--accent-gold)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Transferencia</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Cuentas Nacionales</div>
                    </div>
                  </div>

                  <div
                    className={`payment-tab ${paymentMethod === "binance_pay" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("binance_pay")}
                    id="tab-crypto"
                  >
                    <Coins size={22} color="var(--accent-gold)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Cripto (USDT)</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Binance / Redes</div>
                    </div>
                  </div>
                </div>

                {/* ============= DETAILS ACCORDING TO PAYMENT METHOD ============= */}
                {paymentMethod === "pago_movil" && (
                  <div style={{ background: "var(--bg-elevated)", padding: "24px", borderRadius: "var(--radius-sm)", marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "12px", color: "var(--accent-gold)" }}>
                      Datos para realizar tu Pago Móvil:
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
                      Abre tu aplicación bancaria y emite el Pago Móvil a cualquiera de nuestros bancos autorizados con el monto exacto:
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Teléfono Destino:</span>
                        <div className="copy-field">
                          <strong style={{ fontSize: "0.92rem" }}>{PAYMENT_CONFIG.pagoMovil.phone}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy(PAYMENT_CONFIG.pagoMovil.phone, "pm-phone")}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "4px 8px" }}
                          >
                            {copiedField === "pm-phone" ? <Check size={14} color="var(--status-success)" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Cédula del Titular:</span>
                        <div className="copy-field">
                          <strong style={{ fontSize: "0.92rem" }}>{PAYMENT_CONFIG.pagoMovil.idCard}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy(PAYMENT_CONFIG.pagoMovil.idCard, "pm-id")}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "4px 8px" }}
                          >
                            {copiedField === "pm-id" ? <Check size={14} color="var(--status-success)" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Bancos Disponibles:</span>
                        <div className="copy-field">
                          <strong style={{ fontSize: "0.88rem" }}>Mercantil (0105) / Banesco (0134) / BDV (0102) / Banplus (0174)</strong>
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Monto Exacto en Bolívares:</span>
                        <div className="copy-field" style={{ borderColor: "var(--accent-gold)" }}>
                          <strong style={{ fontSize: "1rem", color: "var(--accent-gold)" }}>{formatBs(totalBs)}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy(totalBs.toFixed(2), "pm-amount")}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "4px 8px" }}
                          >
                            {copiedField === "pm-amount" ? <Check size={14} color="var(--status-success)" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Inputs to confirm */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", paddingTop: "16px", borderTop: "1px solid var(--border-subtle)" }}>
                      <div className="form-group">
                        <label className="form-label">Banco desde el que realizaste el pago *</label>
                        <select
                          className="form-select"
                          value={originBank}
                          onChange={(e) => setOriginBank(e.target.value)}
                          required
                        >
                          <option value="Mercantil">Banco Mercantil</option>
                          <option value="Banesco">Banesco</option>
                          <option value="Banco de Venezuela">Banco de Venezuela (BDV)</option>
                          <option value="Banplus">Banplus</option>
                          <option value="Bancaribe">Bancaribe</option>
                          <option value="BNC">BNC</option>
                          <option value="Otro">Otro Banco Nacional</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Número de Referencia (Últimos 6 u 8 dígitos) *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Ej: 849201"
                          required
                          value={paymentReference}
                          onChange={(e) => setPaymentReference(e.target.value)}
                          id="pm-ref-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TRANSFERENCIA BANCARIA */}
                {paymentMethod === "transferencia" && (
                  <div style={{ background: "var(--bg-elevated)", padding: "24px", borderRadius: "var(--radius-sm)", marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "12px", color: "var(--accent-gold)" }}>
                      Selecciona la cuenta de destino para transferir:
                    </h3>

                    {/* Bank selector */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                      {PAYMENT_CONFIG.bankAccounts.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedBank(b.id)}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            background: selectedBank === b.id ? "var(--accent-gold)" : "var(--bg-surface)",
                            color: selectedBank === b.id ? "#080a10" : "var(--text-primary)",
                            border: "1px solid var(--border-subtle)",
                          }}
                        >
                          {b.bankName}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Número de Cuenta (20 dígitos):</span>
                        <div className="copy-field">
                          <strong style={{ fontSize: "0.95rem", letterSpacing: "0.03em" }}>{activeBankAccount.accountNumber}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy(activeBankAccount.accountNumber, "acc-num")}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "4px 8px" }}
                          >
                            {copiedField === "acc-num" ? <Check size={14} color="var(--status-success)" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Titular:</span>
                          <div className="copy-field">
                            <strong style={{ fontSize: "0.85rem" }}>{activeBankAccount.accountHolder}</strong>
                          </div>
                        </div>

                        <div>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Cédula:</span>
                          <div className="copy-field">
                            <strong style={{ fontSize: "0.85rem" }}>{activeBankAccount.idCard}</strong>
                            <button
                              type="button"
                              onClick={() => handleCopy(activeBankAccount.idCard, "acc-id")}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: "4px 8px" }}
                            >
                              {copiedField === "acc-id" ? <Check size={14} color="var(--status-success)" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Monto a transferir:</span>
                        <div className="copy-field" style={{ borderColor: "var(--accent-gold)" }}>
                          <strong style={{ fontSize: "1rem", color: "var(--accent-gold)" }}>{formatBs(totalBs)}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy(totalBs.toFixed(2), "acc-amount")}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "4px 8px" }}
                          >
                            {copiedField === "acc-amount" ? <Check size={14} color="var(--status-success)" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Reference input */}
                    <div className="form-group" style={{ paddingTop: "14px", borderTop: "1px solid var(--border-subtle)" }}>
                      <label className="form-label">Número de Referencia de la Transferencia *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ej: 009283719"
                        required
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        id="trans-ref-input"
                      />
                    </div>
                  </div>
                )}

                {/* CRIPTO (BINANCE PAY / USDT) */}
                {paymentMethod === "binance_pay" && (
                  <div style={{ background: "var(--bg-elevated)", padding: "24px", borderRadius: "var(--radius-sm)", marginBottom: "24px" }}>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                      <button
                        type="button"
                        onClick={() => setCryptoSubtype("binance")}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          background: cryptoSubtype === "binance" ? "var(--accent-gold)" : "var(--bg-surface)",
                          color: cryptoSubtype === "binance" ? "#080a10" : "var(--text-primary)",
                          border: "1px solid var(--border-subtle)",
                        }}
                      >
                        Binance Pay (Recomendado)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCryptoSubtype("usdt")}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          background: cryptoSubtype === "usdt" ? "var(--accent-gold)" : "var(--bg-surface)",
                          color: cryptoSubtype === "usdt" ? "#080a10" : "var(--text-primary)",
                          border: "1px solid var(--border-subtle)",
                        }}
                      >
                        USDT Directo (Redes TRC20 / BEP20)
                      </button>
                    </div>

                    {cryptoSubtype === "binance" ? (
                      <div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
                          Transfiere directamente sin comisiones mediante <strong>Binance Pay</strong> en la app de Binance:
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                          <div>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Binance Pay ID:</span>
                            <div className="copy-field">
                              <strong style={{ fontSize: "1.05rem", color: "var(--accent-gold)" }}>{PAYMENT_CONFIG.crypto.binancePay.payId}</strong>
                              <button
                                type="button"
                                onClick={() => handleCopy(PAYMENT_CONFIG.crypto.binancePay.payId, "bp-id")}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: "4px 8px" }}
                              >
                                {copiedField === "bp-id" ? <Check size={14} color="var(--status-success)" /> : <Copy size={14} />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Monto Exacto a Enviar:</span>
                            <div className="copy-field">
                              <strong style={{ fontSize: "1.05rem" }}>{totalUsd.toFixed(2)} USDT</strong>
                              <button
                                type="button"
                                onClick={() => handleCopy(totalUsd.toFixed(2), "bp-amount")}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: "4px 8px" }}
                              >
                                {copiedField === "bp-amount" ? <Check size={14} color="var(--status-success)" /> : <Copy size={14} />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">ID de la Transacción / Orden de Binance Pay *</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Ej: 298471029"
                            required
                            value={cryptoTxId}
                            onChange={(e) => setCryptoTxId(e.target.value)}
                            id="binance-order-id"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
                          Billeteras oficiales para depósito directo en USDT:
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                          {PAYMENT_CONFIG.crypto.usdtWallets.map((w, idx) => (
                            <div key={idx}>
                              <span style={{ fontSize: "0.75rem", color: "var(--accent-gold)", fontWeight: 600 }}>{w.network}:</span>
                              <div className="copy-field">
                                <span style={{ fontSize: "0.82rem", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {w.address}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(w.address || "", `wallet-${idx}`)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: "4px 8px", flexShrink: 0 }}
                                >
                                  {copiedField === `wallet-${idx}` ? <Check size={14} color="var(--status-success)" /> : <Copy size={14} />}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="form-group">
                          <label className="form-label">Hash de la Transacción (TXID) *</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="0x... o TXID"
                            required
                            value={cryptoTxId}
                            onChange={(e) => setCryptoTxId(e.target.value)}
                            id="crypto-txid-input"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {errorMsg && (
                  <div style={{ background: "var(--status-error-bg)", border: "1px solid var(--status-error)", color: "#fca5a5", padding: "12px 16px", borderRadius: "var(--radius-sm)", marginBottom: "16px", fontSize: "0.9rem" }}>
                    {errorMsg}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary Box */}
            <div>
              <div
                className="card"
                style={{
                  padding: "28px",
                  position: "sticky",
                  top: "100px",
                  border: "2px solid var(--border-gold)",
                }}
              >
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "18px" }}>
                  Resumen de la Orden
                </h3>

                <div style={{ paddingBottom: "16px", borderBottom: "1px solid var(--border-subtle)", marginBottom: "16px" }}>
                  <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)", marginBottom: "4px" }}>
                    {event.title}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--accent-gold)", marginBottom: "4px" }}>
                    Pase: {tier.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {event.date} • {event.location}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px", fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                    <span>Cantidad:</span>
                    <strong style={{ color: "var(--text-primary)" }}>{quantity} boleto{quantity > 1 ? "s" : ""}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                    <span>Precio unitario:</span>
                    <span>{formatUsd(tier.priceUsd)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                    <span>Tasa oficial BCV:</span>
                    <span>{bcvRate} Bs/USD</span>
                  </div>
                </div>

                {/* Total Box */}
                <div style={{ background: "var(--bg-elevated)", padding: "16px", borderRadius: "var(--radius-sm)", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                    <span>Total en Dólares:</span>
                    <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{formatUsd(totalUsd)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 800 }}>
                    <span>Total en Bs.:</span>
                    <span style={{ color: "var(--accent-gold)" }}>{formatBs(totalBs)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg"
                  style={{ width: "100%", marginBottom: "16px" }}
                  id="btn-confirm-payment"
                >
                  {isSubmitting ? "Procesando Boleto..." : "Confirmar y Emitir Boleto"}
                </button>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center" }}>
                  <ShieldCheck size={16} color="var(--status-success)" />
                  <span>Tu boleto se genera al instante con código QR digital para acceso en puerta</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "80px 0", textAlign: "center" }}>Cargando checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

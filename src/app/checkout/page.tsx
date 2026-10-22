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
  Ticket,
  AlertCircle,
} from "lucide-react";
import { SHAMA_EVENTS } from "@/lib/data";
import { PAYMENT_CONFIG } from "@/lib/payment-config";
import { savePurchase } from "@/lib/store";
import { createQRPayload, generateTicketSignature } from "@/lib/crypto";
import { DEFAULT_BCV_RATE, formatBs, formatUsd, usdToBs } from "@/lib/bcv";
import { PaymentMethod, TicketPurchase } from "@/lib/types";
import { useAuth } from "@/components/AuthContext";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const eventSlug = searchParams.get("event") || SHAMA_EVENTS[0].slug;
  const tierId = searchParams.get("tier");
  const quantity = Math.max(1, parseInt(searchParams.get("qty") || "1", 10));

  const event = SHAMA_EVENTS.find((e) => e.slug === eventSlug) || SHAMA_EVENTS[0];
  const tier = event.tiers.find((t) => t.id === tierId) || event.tiers[0];

  const bcvRate = DEFAULT_BCV_RATE;
  const totalUsd = tier.priceUsd * quantity;
  const totalBs = usdToBs(totalUsd, bcvRate);

  // Form states (Pre-fill if logged in)
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [idCard, setIdCard] = useState(user?.idCard || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [company, setCompany] = useState("");

  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.fullName);
      if (!idCard) setIdCard(user.idCard);
      if (!email) setEmail(user.email);
      if (!phone) setPhone(user.phone);
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pago_movil");
  const [selectedBank, setSelectedBank] = useState("mercantil");
  const [paymentReference, setPaymentReference] = useState("");
  const [originBank, setOriginBank] = useState("Mercantil");
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
      setErrorMsg("Por favor introduce el número de referencia o ID de transacción del pago.");
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
        userId: user?.id,
      },
      paymentMethod,
      paymentDetails: {
        reference: paymentReference.trim() || cryptoTxId.trim(),
        originBank: paymentMethod === "pago_movil" || paymentMethod === "transferencia" ? originBank : undefined,
        senderPhone: paymentMethod === "pago_movil" ? phone.trim() : undefined,
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

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#10b981", "#d97706"],
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
        {/* Navigation */}
        <div style={{ marginBottom: "20px" }}>
          <Link
            href={`/eventos/${event.slug}`}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "0.88rem" }}
          >
            <ArrowLeft size={16} /> Volver a {event.title}
          </Link>
        </div>

        <div style={{ marginBottom: "28px" }}>
          <span className="badge badge-online" style={{ marginBottom: "6px" }}>
            <Lock size={12} /> Checkout Seguro
          </span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>Finalizar Compra de Boletos</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
            Completa los datos del titular y selecciona tu método de pago autorizado en Venezuela.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "start" }}>
            {/* Left Column: Form & Payment Methods */}
            <div>
              {/* Step 1: Attendee Info */}
              <div className="clean-event-card" style={{ padding: "28px", marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--primary-blue)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem" }}>
                    1
                  </div>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)" }}>Datos del Asistente (Titular de la Entrada)</h2>
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
                    <label className="form-label">Cédula de Identidad *</label>
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

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label className="form-label">Correo Electrónico (para envío de QR) *</label>
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
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="clean-event-card" style={{ padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--primary-blue)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem" }}>
                    2
                  </div>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)" }}>Método de Pago en Venezuela</h2>
                </div>

                {/* Tabs */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", marginBottom: "20px" }}>
                  <div
                    onClick={() => setPaymentMethod("pago_movil")}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: paymentMethod === "pago_movil" ? "2px solid var(--primary-blue)" : "1px solid var(--border-subtle)",
                      background: paymentMethod === "pago_movil" ? "var(--primary-blue-light)" : "#ffffff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    id="tab-pago-movil"
                  >
                    <Smartphone size={20} color="var(--primary-blue)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Pago Móvil</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>En Bolívares</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("transferencia")}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: paymentMethod === "transferencia" ? "2px solid var(--primary-blue)" : "1px solid var(--border-subtle)",
                      background: paymentMethod === "transferencia" ? "var(--primary-blue-light)" : "#ffffff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    id="tab-transferencia"
                  >
                    <Building2 size={20} color="var(--primary-blue)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Transferencia</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Cuentas Nacionales</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("binance_pay")}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: paymentMethod === "binance_pay" ? "2px solid var(--primary-blue)" : "1px solid var(--border-subtle)",
                      background: paymentMethod === "binance_pay" ? "var(--primary-blue-light)" : "#ffffff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    id="tab-crypto"
                  >
                    <Coins size={20} color="var(--primary-blue)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Cripto (USDT)</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Binance Pay</div>
                    </div>
                  </div>
                </div>

                {/* PAGO MOVIL CONTENT */}
                {paymentMethod === "pago_movil" && (
                  <div style={{ background: "var(--bg-primary)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border-subtle)", marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                      Datos para emitir Pago Móvil:
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                      <div style={{ background: "#ffffff", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-subtle)" }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Teléfono Destino:</span>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong style={{ fontSize: "0.95rem" }}>{PAYMENT_CONFIG.pagoMovil.phone}</strong>
                          <button type="button" onClick={() => handleCopy(PAYMENT_CONFIG.pagoMovil.phone, "pm-phone")}>
                            {copiedField === "pm-phone" ? <Check size={14} color="#16a34a" /> : <Copy size={14} color="#64748b" />}
                          </button>
                        </div>
                      </div>

                      <div style={{ background: "#ffffff", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-subtle)" }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Cédula del Titular:</span>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong style={{ fontSize: "0.95rem" }}>{PAYMENT_CONFIG.pagoMovil.idCard}</strong>
                          <button type="button" onClick={() => handleCopy(PAYMENT_CONFIG.pagoMovil.idCard, "pm-id")}>
                            {copiedField === "pm-id" ? <Check size={14} color="#16a34a" /> : <Copy size={14} color="#64748b" />}
                          </button>
                        </div>
                      </div>

                      <div style={{ background: "#ffffff", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-subtle)" }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Bancos Disponibles:</span>
                        <strong style={{ fontSize: "0.85rem" }}>Mercantil (0105) / Banesco (0134) / BDV (0102)</strong>
                      </div>

                      <div style={{ background: "#ffffff", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-blue)" }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--primary-blue)", display: "block", fontWeight: 700 }}>Monto Exacto en Bs.:</span>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong style={{ fontSize: "1.05rem", color: "var(--primary-blue)" }}>{formatBs(totalBs)}</strong>
                          <button type="button" onClick={() => handleCopy(totalBs.toFixed(2), "pm-amount")}>
                            {copiedField === "pm-amount" ? <Check size={14} color="#16a34a" /> : <Copy size={14} color="#64748b" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Banco Emisor *</label>
                        <select className="form-select" value={originBank} onChange={(e) => setOriginBank(e.target.value)}>
                          <option value="Mercantil">Banco Mercantil</option>
                          <option value="Banesco">Banesco</option>
                          <option value="Banco de Venezuela">Banco de Venezuela (BDV)</option>
                          <option value="Banplus">Banplus</option>
                          <option value="Bancaribe">Bancaribe</option>
                          <option value="Otro">Otro Banco</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Número de Referencia (Últimos 6 dígitos) *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Ej: 849201"
                          required
                          value={paymentReference}
                          onChange={(e) => setPaymentReference(e.target.value)}
                          id="pm-ref"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TRANSFERENCIA CONTENT */}
                {paymentMethod === "transferencia" && (
                  <div style={{ background: "var(--bg-primary)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border-subtle)", marginBottom: "20px" }}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                      {PAYMENT_CONFIG.bankAccounts.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedBank(b.id)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "4px",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            background: selectedBank === b.id ? "var(--primary-blue)" : "#ffffff",
                            color: selectedBank === b.id ? "#ffffff" : "var(--text-secondary)",
                            border: "1px solid var(--border-subtle)",
                          }}
                        >
                          {b.bankName}
                        </button>
                      ))}
                    </div>

                    <div style={{ background: "#ffffff", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-subtle)", marginBottom: "14px" }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Número de Cuenta:</span>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ fontSize: "0.95rem", fontFamily: "monospace" }}>{activeBankAccount.accountNumber}</strong>
                        <button type="button" onClick={() => handleCopy(activeBankAccount.accountNumber, "acc-num")}>
                          {copiedField === "acc-num" ? <Check size={14} color="#16a34a" /> : <Copy size={14} color="#64748b" />}
                        </button>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                        {activeBankAccount.accountHolder} • {activeBankAccount.idCard}
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Número de Referencia de Transferencia *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ej: 009283719"
                        required
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        id="trans-ref"
                      />
                    </div>
                  </div>
                )}

                {/* CRIPTO CONTENT */}
                {paymentMethod === "binance_pay" && (
                  <div style={{ background: "var(--bg-primary)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border-subtle)", marginBottom: "20px" }}>
                    <div style={{ background: "#ffffff", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-subtle)", marginBottom: "14px" }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Binance Pay ID:</span>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ fontSize: "1.1rem", color: "var(--primary-blue)" }}>{PAYMENT_CONFIG.crypto.binancePay.payId}</strong>
                        <button type="button" onClick={() => handleCopy(PAYMENT_CONFIG.crypto.binancePay.payId, "bp-id")}>
                          {copiedField === "bp-id" ? <Check size={14} color="#16a34a" /> : <Copy size={14} color="#64748b" />}
                        </button>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                        Monto exacto: <strong>{totalUsd.toFixed(2)} USDT</strong>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">ID de Orden / Transacción Binance *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ej: 298471029"
                        required
                        value={cryptoTxId}
                        onChange={(e) => setCryptoTxId(e.target.value)}
                        id="crypto-id"
                      />
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div style={{ background: "var(--status-error-bg)", border: "1px solid var(--status-error)", color: "var(--status-error)", padding: "10px 14px", borderRadius: "6px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div style={{ position: "sticky", top: "88px" }}>
              <div className="clean-event-card" style={{ padding: "24px" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "16px" }}>
                  Resumen de la Orden
                </h3>

                <div style={{ paddingBottom: "14px", borderBottom: "1px solid var(--border-subtle)", marginBottom: "14px" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.98rem", color: "var(--text-primary)", marginBottom: "2px" }}>
                    {event.title}
                  </div>
                  <span className="badge badge-online">{tier.name}</span>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    {event.date} • {event.location}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                    <span>Cantidad:</span>
                    <strong>{quantity} boleto{quantity > 1 ? "s" : ""}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                    <span>Precio Unitario:</span>
                    <span>{formatUsd(tier.priceUsd)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                    <span>Tasa Oficial BCV:</span>
                    <span>{bcvRate} Bs/USD</span>
                  </div>
                </div>

                {/* Total Box */}
                <div style={{ background: "var(--bg-primary)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-subtle)", marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    <span>Total USD:</span>
                    <strong style={{ color: "var(--text-primary)" }}>{formatUsd(totalUsd)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: 800 }}>
                    <span>Total Bs.:</span>
                    <span style={{ color: "var(--primary-blue)" }}>{formatBs(totalBs)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "14px", fontSize: "1rem", marginBottom: "12px" }}
                  id="btn-confirm-checkout"
                >
                  {isSubmitting ? "Emitiendo Boleto..." : "Confirmar y Emitir Boleto"}
                </button>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>
                  <ShieldCheck size={14} color="#16a34a" />
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

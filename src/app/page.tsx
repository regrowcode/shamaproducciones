"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Ticket,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  Video,
  MapPin,
  QrCode,
  PackageOpen,
  CheckCircle2,
} from "lucide-react";
import { SHAMA_EVENTS } from "@/lib/data";
import { EventFormat } from "@/lib/types";
import EventCard from "@/components/EventCard";
import { useCurrency } from "@/components/CurrencyContext";

export default function HomePage() {
  const [selectedFormat, setSelectedFormat] = useState<string>("todos");
  const { rate } = useCurrency();

  const filteredEvents = SHAMA_EVENTS.filter((e) => {
    if (selectedFormat === "todos") return true;
    return e.format === selectedFormat;
  });

  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <div className="container">
          <div className="hero-tag">
            <Sparkles size={16} /> PRODUCCIÓN AUDIOVISUAL & EVENTOS EN VIVO
          </div>

          <h1 className="hero-title">
            Experiencias de Alto Impacto, <span className="gradient-text">Conferencias & Masterclasses</span>
          </h1>

          <p className="hero-subtitle">
            Tiquetera 100% digital para eventos presenciales y conferencias online en Venezuela.
            Paga en Bolívares con <strong>Pago Móvil, Transferencias nacionales o Cripto (USDT)</strong> y recibe tu boleto con QR dinámico anti-fraude.
          </p>

          <div className="hero-buttons">
            <Link href="/eventos" className="btn btn-primary btn-lg" id="hero-cta-events">
              <Ticket size={20} /> Explorar Cartelera de Eventos
            </Link>
            <Link href="/validador" className="btn btn-secondary btn-lg" id="hero-cta-validator">
              <QrCode size={20} /> Validador en Puerta (Staff)
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">4+</div>
              <div className="stat-label">Eventos Flagship 2026</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">100%</div>
              <div className="stat-label">Boletos Digitales con Cifrado</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">Bs / USDT</div>
              <div className="stat-label">Tasa Oficial BCV ({rate} Bs/$)</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">&lt; 3 seg</div>
              <div className="stat-label">Check-in Express en Entrada</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED EVENTS SECTION ================= */}
      <section style={{ padding: "60px 0 80px" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "30px" }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: "8px" }}>
                Cartelera Oficial
              </span>
              <h2 style={{ fontSize: "2.2rem", fontWeight: 800 }}>Próximos Eventos & Masterclasses</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                Selecciona tu formato preferido y asegura tu cupo de forma inmediata.
              </p>
            </div>

            {/* Filter pills */}
            <div style={{ display: "flex", gap: "8px", background: "var(--bg-surface)", padding: "4px", borderRadius: "var(--radius-full)", border: "1px solid var(--border-subtle)" }}>
              {[
                { id: "todos", label: "Todos" },
                { id: "presencial", label: "Presenciales" },
                { id: "online", label: "Online" },
                { id: "hibrido", label: "Híbridos" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setSelectedFormat(pill.id)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    background: selectedFormat === pill.id ? "var(--accent-gold)" : "transparent",
                    color: selectedFormat === pill.id ? "#080a10" : "var(--text-secondary)",
                    transition: "all 0.2s ease",
                  }}
                  id={`filter-${pill.id}`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Events */}
          <div className="events-grid">
            {filteredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= VALUE PROPOSITION / FEATURES ================= */}
      <section style={{ padding: "70px 0", background: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "650px", margin: "0 auto 50px" }}>
            <span className="badge badge-gold" style={{ marginBottom: "8px" }}>
              Ventajas Shama
            </span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "14px" }}>
              ¿Por qué nuestra Tiquetera es Superior?
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Diseñada específicamente para resolver los problemas de compra, reventa y verificación en Venezuela.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {/* Feature 1 */}
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-gold)", marginBottom: "20px" }}>
                <Zap size={26} />
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Pago Móvil Directo en Bs.</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                Paga a través de tus bancos de confianza (Mercantil, Banesco, BDV, Banplus) con cálculo automático en Bolívares según la tasa oficial del día.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--status-success)", marginBottom: "20px" }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>QR Criptográfico Anti-Fraude</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                Cada boleto cuenta con una firma digital única e irrepetible. Nuestro sistema detecta automáticamente intentos de duplicación o reventa ilegal.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-cyan)", marginBottom: "20px" }}>
                <Video size={26} />
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Salas de Streaming Protegidas</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                Para conferencias virtuales, cada comprador recibe un <em>Magic Link</em> personal con bloqueo de sesiones simultáneas y chat en vivo con los ponentes.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "rgba(139, 92, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-purple)", marginBottom: "20px" }}>
                <Globe size={26} />
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Billetera Cripto (Binance Pay)</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                Paga en USDT con un escaneo desde Binance Pay o vía redes Tron/BNB sin comisiones internacionales de tarjeta de crédito.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ECOMMERCE ON-DEMAND TEASER (PHASE 2) ================= */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div
            className="glass-panel"
            style={{
              padding: "48px 40px",
              background: "linear-gradient(135deg, rgba(27, 35, 57, 0.8) 0%, rgba(15, 20, 34, 0.95) 100%)",
              border: "1px solid var(--border-gold)",
              borderRadius: "var(--radius-lg)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ maxWidth: "700px" }}>
              <span className="badge badge-gold" style={{ marginBottom: "16px" }}>
                <PackageOpen size={14} /> Próximamente • Fase 2
              </span>
              <h2 style={{ fontSize: "2.3rem", fontWeight: 800, marginBottom: "14px", lineHeight: "1.2" }}>
                Importación Audiovisual On-Demand por Enlace
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: "24px" }}>
                ¿Necesitas cámaras, lentes, luces, micrófonos o cualquier producto de <strong>B&H Photo, Amazon, eBay, Temu, Shein o AliExpress</strong>?
                Solo pegarás el enlace y nuestra calculadora te mostrará el costo exacto puesto en tu puerta en Venezuela, todo pagado en Bolívares.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "var(--text-muted)", fontSize: "0.88rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 size={16} color="var(--accent-gold)" /> Sin necesidad de tarjeta en dólares
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 size={16} color="var(--accent-gold)" /> Flete aéreo y marítimo consolidado
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 size={16} color="var(--accent-gold)" /> Gestión aduanal incluida
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

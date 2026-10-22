"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Ticket,
  ChevronRight,
} from "lucide-react";
import { ShamaEvent } from "@/lib/types";
import { useCurrency } from "@/components/CurrencyContext";

interface EventDetailClientProps {
  event: ShamaEvent;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const router = useRouter();
  const { formatPrice, rate } = useCurrency();
  const [selectedTierId, setSelectedTierId] = useState<string>(event.tiers[0]?.id || "");
  const [quantity, setQuantity] = useState<number>(1);

  const selectedTier = event.tiers.find((t) => t.id === selectedTierId) || event.tiers[0];
  const totalPriceUsd = selectedTier ? selectedTier.priceUsd * quantity : 0;
  const priceDisplay = formatPrice(totalPriceUsd);

  const handleProceedToCheckout = () => {
    router.push(`/checkout?event=${event.slug}&tier=${selectedTierId}&qty=${quantity}`);
  };

  return (
    <div style={{ padding: "30px 0 80px" }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: "20px" }}>
          <Link
            href="/eventos"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
            }}
          >
            <ArrowLeft size={16} /> Volver a la cartelera de eventos
          </Link>
        </div>

        {/* Hero Banner Card */}
        <div
          className="card"
          style={{
            position: "relative",
            minHeight: "360px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "40px 32px",
            marginBottom: "40px",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          {/* Background image with dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(180deg, rgba(8, 10, 16, 0.4) 0%, rgba(8, 10, 16, 0.95) 100%), url(${event.bannerUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 1,
            }}
          />

          <div style={{ position: "relative", zIndex: 2, maxWidth: "800px" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
              {event.format === "presencial" && (
                <span className="badge badge-presencial">
                  <MapPin size={12} /> Presencial
                </span>
              )}
              {event.format === "online" && (
                <span className="badge badge-online">
                  <Video size={12} /> Streaming Online HD
                </span>
              )}
              {event.format === "hibrido" && (
                <span className="badge badge-hibrido">
                  <Users size={12} /> Formato Híbrido
                </span>
              )}
              <span className="badge badge-gold">{event.category}</span>
            </div>

            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: "12px", lineHeight: "1.15" }}>
              {event.title}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "24px" }}>
              {event.subtitle}
            </p>

            {/* Quick Specs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", fontSize: "0.92rem", color: "var(--text-primary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={18} color="var(--accent-gold)" />
                <strong>{event.date}</strong>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Clock size={18} color="var(--accent-gold)" />
                <span>{event.time}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin size={18} color="var(--accent-gold)" />
                <span>{event.location} ({event.city})</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Details on Left, Ticket Box on Right */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "40px", alignItems: "start" }}>
          {/* Left Column: Event Info */}
          <div>
            {/* Description */}
            <section className="glass-panel" style={{ padding: "32px", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", color: "var(--accent-gold)" }}>
                Acerca de este evento
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: "1.8", whiteSpace: "pre-line" }}>
                {event.description}
              </p>
            </section>

            {/* Speakers */}
            <section className="glass-panel" style={{ padding: "32px", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "20px" }}>
                Ponentes e Instructores
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                {event.speakers.map((spk, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      background: "var(--bg-elevated)",
                      padding: "16px",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <Image
                      src={spk.avatarUrl}
                      alt={spk.name}
                      width={56}
                      height={56}
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "2px" }}>{spk.name}</h4>
                      <p style={{ fontSize: "0.82rem", color: "var(--accent-gold)" }}>{spk.role}</p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{spk.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Agenda Schedule */}
            <section className="glass-panel" style={{ padding: "32px" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "20px" }}>
                Programa y Cronograma
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {event.schedule.map((sch, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "110px 1fr",
                      gap: "16px",
                      paddingBottom: "16px",
                      borderBottom: idx < event.schedule.length - 1 ? "1px solid var(--border-subtle)" : "none",
                    }}
                  >
                    <div style={{ fontWeight: 700, color: "var(--accent-gold)", fontSize: "0.95rem" }}>
                      {sch.time}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "4px" }}>
                        {sch.title}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        {sch.speaker}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Ticket Selector Engine */}
          <div style={{ position: "sticky", top: "100px" }}>
            <div
              className="card"
              style={{
                padding: "30px",
                border: "2px solid var(--border-gold)",
                boxShadow: "var(--shadow-gold)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <Ticket size={20} color="var(--accent-gold)" />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Tiquetera Oficial</h3>
              </div>

              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                Selecciona la categoría de boleto que deseas adquirir:
              </p>

              {/* Tiers List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                {event.tiers.map((tier) => {
                  const isSelected = selectedTierId === tier.id;
                  const tierPrice = formatPrice(tier.priceUsd);

                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTierId(tier.id)}
                      className={`tier-card ${isSelected ? "selected" : ""}`}
                      style={{ cursor: "pointer" }}
                      id={`tier-select-${tier.id}`}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                        <div style={{ fontWeight: 700, fontSize: "1.05rem", color: isSelected ? "var(--accent-gold)" : "var(--text-primary)" }}>
                          {tier.name}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--accent-gold)" }}>
                            {tierPrice.main}
                          </span>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                            {tierPrice.secondary}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
                        {tier.description}
                      </p>

                      <ul className="tier-perks-list">
                        {tier.perks.map((perk, i) => (
                          <li key={i} className="tier-perk-item">
                            <CheckCircle2 size={14} color="var(--status-success)" style={{ flexShrink: 0 }} />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Quantity Selector */}
              <div style={{ marginBottom: "24px" }}>
                <label className="form-label">Cantidad de Boletos</label>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    style={{ width: "42px", height: "42px", padding: 0 }}
                    id="btn-qty-minus"
                  >
                    -
                  </button>
                  <span style={{ fontSize: "1.2rem", fontWeight: 800, minWidth: "40px", textAlign: "center" }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setQuantity(Math.min(5, quantity + 1))}
                    disabled={quantity >= 5}
                    style={{ width: "42px", height: "42px", padding: 0 }}
                    id="btn-qty-plus"
                  >
                    +
                  </button>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    (Máximo 5 por orden)
                  </span>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div
                style={{
                  background: "var(--bg-elevated)",
                  borderRadius: "var(--radius-sm)",
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                  <span>Subtotal ({quantity} boleto{quantity > 1 ? "s" : ""}):</span>
                  <span>{priceDisplay.main}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  <span>Total a Pagar:</span>
                  <span style={{ color: "var(--accent-gold)" }}>{priceDisplay.main}</span>
                </div>
                <div style={{ textAlign: "right", fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  Equivalente: <strong>{priceDisplay.secondary}</strong> (Tasa BCV {rate} Bs/$)
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{ width: "100%", marginBottom: "14px" }}
                onClick={handleProceedToCheckout}
                id="btn-proceed-checkout"
              >
                Continuar al Pago <ChevronRight size={18} />
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                <ShieldCheck size={14} color="var(--status-success)" />
                <span>Pago Móvil, Transferencias y Binance Pay habilitados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

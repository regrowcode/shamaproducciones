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
              fontSize: "0.88rem",
            }}
          >
            <ArrowLeft size={16} /> Volver a la cartelera de eventos
          </Link>
        </div>

        {/* Hero Banner Card (Clean aesthetic) */}
        <div
          className="clean-event-card"
          style={{
            position: "relative",
            minHeight: "340px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "40px 32px",
            marginBottom: "36px",
            borderRadius: "16px",
            overflow: "hidden",
            color: "#ffffff",
          }}
        >
          {/* Background image with overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%), url(${event.bannerUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 1,
            }}
          />

          <div style={{ position: "relative", zIndex: 2, maxWidth: "800px" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
              {event.format === "presencial" && (
                <span className="badge badge-presencial">Presencial</span>
              )}
              {event.format === "online" && (
                <span className="badge badge-online">Streaming Online HD</span>
              )}
              {event.format === "hibrido" && (
                <span className="badge badge-hibrido">Formato Híbrido</span>
              )}
              <span className="badge badge-gold">{event.category}</span>
            </div>

            <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.7rem)", fontWeight: 900, marginBottom: "10px", lineHeight: "1.2" }}>
              {event.title}
            </h1>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.05rem", marginBottom: "20px" }}>
              {event.subtitle}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", fontSize: "0.88rem", color: "#f8fafc" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Calendar size={16} color="var(--primary-blue-light)" />
                <strong>{event.date}</strong>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Clock size={16} color="var(--primary-blue-light)" />
                <span>{event.time}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={16} color="var(--primary-blue-light)" />
                <span>{event.location} ({event.city})</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Details on Left, Ticket Box on Right */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "36px", alignItems: "start" }}>
          {/* Left Column: Event Info */}
          <div>
            {/* Description */}
            <section className="clean-event-card" style={{ padding: "32px", marginBottom: "28px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "16px", color: "var(--text-primary)" }}>
                Acerca de este evento
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.98rem", lineHeight: "1.7", whiteSpace: "pre-line" }}>
                {event.description}
              </p>
            </section>

            {/* Speakers */}
            <section className="clean-event-card" style={{ padding: "32px", marginBottom: "28px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "20px", color: "var(--text-primary)" }}>
                Ponentes e Instructores
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                {event.speakers.map((spk, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background: "var(--bg-primary)",
                      padding: "14px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <Image
                      src={spk.avatarUrl}
                      alt={spk.name}
                      width={50}
                      height={50}
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "2px", color: "var(--text-primary)" }}>{spk.name}</h4>
                      <p style={{ fontSize: "0.78rem", color: "var(--primary-blue)", fontWeight: 600 }}>{spk.role}</p>
                      <p style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>{spk.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Agenda Schedule */}
            <section className="clean-event-card" style={{ padding: "32px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "20px", color: "var(--text-primary)" }}>
                Programa y Cronograma
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {event.schedule.map((sch, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "100px 1fr",
                      gap: "14px",
                      paddingBottom: "14px",
                      borderBottom: idx < event.schedule.length - 1 ? "1px solid var(--border-subtle)" : "none",
                    }}
                  >
                    <div style={{ fontWeight: 800, color: "var(--primary-blue)", fontSize: "0.9rem" }}>
                      {sch.time}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "2px" }}>
                        {sch.title}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                        {sch.speaker}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Ticket Selector Engine */}
          <div style={{ position: "sticky", top: "88px" }}>
            <div
              className="clean-event-card"
              style={{
                padding: "26px",
                borderTop: "4px solid var(--primary-blue)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <Ticket size={20} color="var(--primary-blue)" />
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)" }}>Selección de Boletos</h3>
              </div>

              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "18px" }}>
                Elige la localidad o pase que deseas adquirir:
              </p>

              {/* Tiers List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {event.tiers.map((tier) => {
                  const isSelected = selectedTierId === tier.id;
                  const tierPrice = formatPrice(tier.priceUsd);

                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTierId(tier.id)}
                      style={{
                        padding: "14px",
                        borderRadius: "8px",
                        border: isSelected ? "2px solid var(--primary-blue)" : "1px solid var(--border-subtle)",
                        background: isSelected ? "var(--primary-blue-light)" : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                      id={`tier-select-${tier.id}`}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                        <div style={{ fontWeight: 700, fontSize: "0.98rem", color: isSelected ? "var(--primary-blue)" : "var(--text-primary)" }}>
                          {tier.name}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--primary-blue)" }}>
                            {tierPrice.main}
                          </span>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            {tierPrice.secondary}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                        {tier.description}
                      </p>

                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                        {tier.perks.map((perk, i) => (
                          <li key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <CheckCircle2 size={12} color="#16a34a" style={{ flexShrink: 0 }} />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Quantity Selector */}
              <div style={{ marginBottom: "20px" }}>
                <label className="form-label" style={{ fontSize: "0.82rem" }}>Cantidad de Boletos</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    style={{ width: "36px", height: "36px", padding: 0 }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: "1.1rem", fontWeight: 800, minWidth: "32px", textAlign: "center" }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setQuantity(Math.min(5, quantity + 1))}
                    disabled={quantity >= 5}
                    style={{ width: "36px", height: "36px", padding: 0 }}
                  >
                    +
                  </button>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    (Máx. 5 por orden)
                  </span>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div
                style={{
                  background: "var(--bg-primary)",
                  borderRadius: "8px",
                  padding: "14px",
                  marginBottom: "18px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  <span>Subtotal ({quantity} boleto{quantity > 1 ? "s" : ""}):</span>
                  <span>{priceDisplay.main}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  <span>Total a Pagar:</span>
                  <span style={{ color: "var(--primary-blue)" }}>{priceDisplay.main}</span>
                </div>
                <div style={{ textAlign: "right", fontSize: "0.78rem", color: "var(--accent-gold)", fontWeight: 600, marginTop: "2px" }}>
                  Equivalente: {priceDisplay.secondary} (Tasa BCV {rate} Bs/$)
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "100%", padding: "14px", fontSize: "1rem", marginBottom: "12px" }}
                onClick={handleProceedToCheckout}
                id="btn-proceed-checkout"
              >
                Comprar Boletos <ChevronRight size={18} />
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                <ShieldCheck size={14} color="#16a34a" />
                <span>Pago Móvil, Transferencias y Binance Pay autorizados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

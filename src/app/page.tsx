"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Smartphone,
  Video,
} from "lucide-react";
import { getAllEvents } from "@/lib/services/event-service";
import EventSearchRibbon from "@/components/EventSearchRibbon";
import EventCard from "@/components/EventCard";
import { useCurrency } from "@/components/CurrencyContext";

export default function HomePage() {
  const allEvents = getAllEvents();
  const featured = allEvents[0];
  const { formatPrice } = useCurrency();
  const [activeCategory, setActiveCategory] = useState("todas");

  const filteredEvents = allEvents.filter((e) => {
    if (activeCategory === "todas") return true;
    return e.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const featuredMinPrice = Math.min(...featured.tiers.map((t) => t.priceUsd));
  const featuredPrice = formatPrice(featuredMinPrice);

  return (
    <div>
      {/* 1. Integrated Search Ribbon (La Tiquetera style) */}
      <EventSearchRibbon />

      {/* 2. Featured Big Hero Event Banner (La Tiquetera style) */}
      <section style={{ padding: "36px 0 20px" }}>
        <div className="container">
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-card-hover)",
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
            }}
          >
            {/* Banner image */}
            <div style={{ position: "relative", minHeight: "340px" }}>
              <Image
                src={featured.bannerUrl}
                alt={featured.title}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 55vw"
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  background: "var(--bg-header-main)",
                  color: "#ffffff",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontWeight: 800,
                  fontSize: "0.78rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                EVENTO DESTACADO
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span className="badge badge-gold" style={{ alignSelf: "flex-start", marginBottom: "10px" }}>
                {featured.category}
              </span>
              <h2 style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 900, color: "var(--text-primary)", lineHeight: "1.2", marginBottom: "12px" }}>
                {featured.title}
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "20px" }}>
                {featured.subtitle}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "24px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Calendar size={15} color="var(--primary-blue)" /> <strong>{featured.date}</strong>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <MapPin size={15} color="var(--primary-blue)" /> {featured.location}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "18px", borderTop: "1px solid var(--border-subtle)" }}>
                <div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Desde</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--primary-blue)" }}>
                    {featuredPrice.main}
                  </div>
                </div>

                <Link href={`/eventos/${featured.slug}`} className="btn btn-primary" id="btn-featured-buy">
                  Comprar Boletos <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Event Catalog with Quick Category Pills */}
      <section style={{ padding: "40px 0 60px" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
            <div>
              <h2 style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Cartelera Oficial de Eventos
              </h2>
              <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>
                Selecciona tu evento y adquiere tus pases digitales con Pago Móvil, transferencia o Cripto.
              </p>
            </div>

            {/* Quick Pills */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {[
                { id: "todas", label: "Todos" },
                { id: "conferencia", label: "Conferencias" },
                { id: "masterclass", label: "Masterclasses" },
                { id: "taller", label: "Talleres" },
                { id: "seminario", label: "Seminarios Online" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setActiveCategory(pill.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    background: activeCategory === pill.id ? "var(--primary-blue)" : "#ffffff",
                    color: activeCategory === pill.id ? "#ffffff" : "var(--text-secondary)",
                    border: "1px solid var(--border-subtle)",
                    boxShadow: "var(--shadow-sm)",
                    transition: "all 0.15s ease",
                  }}
                  id={`cat-pill-${pill.id}`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Events */}
          <div className="events-clean-grid">
            {filteredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Shama Tiquetera? (Trust & Venezuelan Payment Benefits) */}
      <section style={{ background: "#ffffff", padding: "60px 0", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 40px" }}>
            <h2 style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
              ¿Por qué elegir Shama Tiquetera?
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
              Tu boleto digital seguro en minutos, sin filas ni boletos físicos que perder.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
            <div style={{ padding: "24px", borderRadius: "12px", background: "var(--bg-primary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "var(--primary-blue-light)", color: "var(--primary-blue)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <Smartphone size={22} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>Pago Móvil Directo en Bs.</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Paga a través de Mercantil, Banesco, Banco de Venezuela o Banplus con cálculo automático según la tasa oficial BCV.
              </p>
            </div>

            <div style={{ padding: "24px", borderRadius: "12px", background: "var(--bg-primary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "var(--accent-emerald-bg)", color: "var(--accent-emerald)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>Código QR Anti-Falsificación</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Cada entrada tiene firma criptográfica digital HMAC-SHA256, imposibilitando la reventa ilegal o duplicados.
              </p>
            </div>

            <div style={{ padding: "24px", borderRadius: "12px", background: "var(--bg-primary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "var(--accent-gold-bg)", color: "var(--accent-gold)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <Zap size={22} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>Acreditación Express</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Solo muestra tu celular en la puerta del teatro o salón. Validación en menos de 2 segundos para evitar colas.
              </p>
            </div>

            <div style={{ padding: "24px", borderRadius: "12px", background: "var(--bg-primary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "var(--accent-magenta-bg)", color: "var(--accent-magenta)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <Video size={22} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>Streaming HD Individual</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Para seminarios online, tu boleto incluye un <em>Magic Link</em> individual con sala virtual HD y chat interactivo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

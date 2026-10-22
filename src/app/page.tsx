"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Ticket,
  Calendar,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { getAllEvents } from "@/lib/services/event-service";
import EventCard from "@/components/EventCard";

export default function HomePage() {
  const events = getAllEvents();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Featured events for top panoramic slider (Photo 1 style)
  const slides = events.slice(0, 3);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const activeEvent = slides[currentSlide] || events[0];

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", paddingBottom: "70px" }}>
      {/* ================= 1. PANORAMIC HERO CAROUSEL (PHOTO 1 STYLE) ================= */}
      <section style={{ background: "#0a0a0c", position: "relative", overflow: "hidden", minHeight: "360px" }}>
        <div style={{ position: "relative", width: "100%", height: "380px" }}>
          {/* Active slide banner */}
          <Link href={`/eventos/${activeEvent.slug}`} style={{ display: "block", position: "relative", width: "100%", height: "100%" }}>
            <Image
              src={activeEvent.bannerUrl}
              alt={activeEvent.title}
              fill
              priority
              style={{ objectFit: "cover", opacity: 0.85 }}
            />
            {/* Cinematic overlay & Title */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.85) 100%)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="container">
                <div style={{ maxWidth: "650px", color: "#ffffff" }}>
                  <span
                    style={{
                      background: "#2563eb",
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      padding: "4px 10px",
                      borderRadius: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      display: "inline-block",
                      marginBottom: "12px",
                    }}
                  >
                    EVENTO DESTACADO • {activeEvent.city}
                  </span>
                  <h1
                    style={{
                      fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                      fontWeight: 900,
                      lineHeight: "1.15",
                      marginBottom: "10px",
                      textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                    }}
                  >
                    {activeEvent.title}
                  </h1>
                  <p style={{ color: "#cbd5e1", fontSize: "1rem", marginBottom: "20px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {activeEvent.subtitle}
                  </p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#ffffff", color: "#0f172a", padding: "10px 22px", borderRadius: "6px", fontWeight: 800, fontSize: "0.95rem" }}>
                    Comprar Boletos <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Left Arrow */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Anterior"
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(0, 0, 0, 0.6)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              zIndex: 10,
              transition: "background 0.2s",
            }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Siguiente"
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(0, 0, 0, 0.6)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              zIndex: 10,
              transition: "background 0.2s",
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* ================= 2. MAIN EVENTS SHOWCASE (PHOTO 1 LAYOUT) ================= */}
      <section style={{ paddingTop: "40px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: "32px", alignItems: "start" }}>
            {/* Left Main: Event Cards Grid (Photo 1) */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#0f172a", textTransform: "uppercase", letterSpacing: "-0.01em" }}>
                  Cartelera de Eventos
                </h2>
                <Link href="/eventos" style={{ color: "#2563eb", fontWeight: 700, fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  Ver todos los eventos <ArrowRight size={14} />
                </Link>
              </div>

              {/* Event Cards Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
                  gap: "24px 20px",
                }}
              >
                {events.map((evt) => (
                  <EventCard key={evt.id} event={evt} />
                ))}
              </div>
            </div>

            {/* Right Side: Promotion / Info Banners (Matching Photo 1 side banners) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Banner 1: Venda su evento */}
              <Link
                href="/venda-su-evento"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
                  borderRadius: "8px",
                  padding: "20px 16px",
                  color: "#ffffff",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)",
                  transition: "transform 0.2s",
                }}
              >
                <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", opacity: 0.9 }}>
                  ORGANIZADORES
                </span>
                <strong style={{ fontSize: "1.1rem", fontWeight: 900, margin: "4px 0 8px" }}>
                  VENDA SU EVENTO
                </strong>
                <span style={{ fontSize: "0.8rem", opacity: 0.9 }}>
                  Gestione su boletería con nosotros en Barquisimeto y toda Venezuela.
                </span>
              </Link>

              {/* Banner 2: Puntos de Venta */}
              <div
                style={{
                  background: "linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)",
                  borderRadius: "8px",
                  padding: "20px 16px",
                  color: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 12px rgba(30, 58, 138, 0.2)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <MapPin size={22} color="#fef08a" />
                  <strong style={{ fontSize: "1rem", fontWeight: 900 }}>
                    TAQUILLAS & SEDE
                  </strong>
                </div>
                <p style={{ fontSize: "0.8rem", color: "#e2e8f0", marginTop: "8px", lineHeight: "1.4" }}>
                  Atención en <strong>Barquisimeto, Venezuela</strong>. Pagos online en Pago Móvil, Transferencias y Cripto.
                </p>
              </div>

              {/* Banner 3: Atención y Soporte */}
              <a
                href="https://wa.me/584121234567"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "16px",
                  color: "#0f172a",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#22c55e", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <HelpCircle size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 800 }}>¿Dudas con tu compra?</div>
                  <div style={{ fontSize: "0.78rem", color: "#64748b" }}>Escríbenos por WhatsApp</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

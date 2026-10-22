"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Ticket,
  ShieldCheck,
  TrendingUp,
  Smartphone,
  Users,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  Check,
} from "lucide-react";

export default function VendaSuEventoPage() {
  const [organizerName, setOrganizerName] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("Concierto");
  const [city, setCity] = useState("Barquisimeto");
  const [capacity, setCapacity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ paddingBottom: "80px" }}>
      {/* Hero Section (Business style) */}
      <section
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)",
          color: "#ffffff",
          padding: "70px 0 60px",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: "800px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.12)",
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#fef08a",
              marginBottom: "20px",
            }}
          >
            <Sparkles size={16} /> SOLUCIONES PARA ORGANIZADORES & PRODUCTORES
          </div>

          <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: 900, lineHeight: "1.15", marginBottom: "16px" }}>
            Venda las entradas de su evento con Shama Tiquetera
          </h1>

          <p style={{ fontSize: "1.1rem", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "32px" }}>
            La plataforma de boletería digital más confiable de Barquisimeto y Venezuela.
            Aumente sus ventas con <strong>Pago Móvil, Transferencias y Cripto</strong>, y controle el acceso de sus asistentes sin boletos físicos.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
            <a href="#formulario-contacto" className="btn btn-primary btn-lg" style={{ background: "#ffffff", color: "var(--primary-blue)" }}>
              Registrar Mi Evento <ArrowRight size={18} />
            </a>
            <a
              href="https://wa.me/584121234567?text=Hola,%20deseo%20vender%20las%20entradas%20de%20mi%20evento%20con%20Shama%20Tiquetera"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-white btn-lg"
            >
              <MessageCircle size={18} color="#22c55e" /> Hablar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section style={{ padding: "70px 0", background: "#ffffff", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "10px" }}>
              Todo lo que necesita para el éxito de su evento
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Elimine las pérdidas por duplicados de boletos de papel y brinde una experiencia moderna a su público.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "28px" }}>
            <div className="clean-event-card" style={{ padding: "28px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "var(--primary-blue-light)", color: "var(--primary-blue)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                <Smartphone size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "10px" }}>Pagos Nacionales en Bs.</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                Acepte Pago Móvil y transferencias de los principales bancos de Venezuela (Mercantil, Banesco, BDV, Banplus) y USDT sin rechazos por tarjetas internacionales.
              </p>
            </div>

            <div className="clean-event-card" style={{ padding: "28px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "var(--accent-emerald-bg)", color: "var(--accent-emerald)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "10px" }}>Control de Acceso QR Offline</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                Aplicación de escaneo para su personal en puerta. Cada boleto tiene firma criptográfica única, imposibilitando la reventa o el reingreso no autorizado.
              </p>
            </div>

            <div className="clean-event-card" style={{ padding: "28px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "var(--accent-gold-bg)", color: "var(--accent-gold)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "10px" }}>Panel de Ventas en Vivo</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                Vea minuto a minuto cuántas entradas ha vendido, el aforo restante y la recaudación total en dólares y bolívares.
              </p>
            </div>

            <div className="clean-event-card" style={{ padding: "28px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "var(--accent-magenta-bg)", color: "var(--accent-magenta)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "10px" }}>Soporte en Barquisimeto</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
                Atención personalizada, configuración de localidades y acompañamiento técnico el día del evento en el Teatro Juares, Arena Plaza o recintos privados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="formulario-contacto" style={{ padding: "70px 0" }}>
        <div className="container" style={{ maxWidth: "700px" }}>
          <div className="clean-event-card" style={{ padding: "40px 36px", borderTop: "5px solid var(--primary-blue)" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <span className="badge badge-online" style={{ marginBottom: "8px" }}>
                Formulario de Negociación Directa
              </span>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Hablemos de su próximo evento
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "4px" }}>
                Complete los datos y nuestro equipo se comunicará en menos de 2 horas.
              </p>
            </div>

            {submitted ? (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #16a34a",
                  borderRadius: "10px",
                  padding: "32px 24px",
                  textAlign: "center",
                }}
              >
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#16a34a", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Check size={28} />
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#166534", marginBottom: "8px" }}>
                  ¡Solicitud Enviada con Éxito!
                </h3>
                <p style={{ color: "#166534", fontSize: "0.95rem", lineHeight: "1.6" }}>
                  Gracias <strong>{organizerName}</strong>. Hemos recibido los detalles de <strong>{eventName}</strong>. Uno de nuestros ejecutivos de Shama Producciones se pondrá en contacto al <strong>{phone}</strong> para formalizar la publicación y venta.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">Nombre del Organizador o Empresa *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej: Producciones Lara C.A."
                      required
                      value={organizerName}
                      onChange={(e) => setOrganizerName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nombre del Evento *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej: Festival de Rock 2026"
                      required
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tipo de Evento</label>
                    <select
                      className="form-select"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                    >
                      <option value="Concierto">Concierto / Música en Vivo</option>
                      <option value="Conferencia">Conferencia / Congreso</option>
                      <option value="Teatro">Teatro / Comedia</option>
                      <option value="Masterclass">Masterclass / Taller</option>
                      <option value="Deportivo">Evento Deportivo</option>
                      <option value="Otro">Otro Tipo de Evento</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ciudad / Recinto *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej: Teatro Juares (Barquisimeto)"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Aforo Estimado (Cupos)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej: 500 personas"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
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
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label className="form-label">Correo Electrónico *</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="contacto@organizacion.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label className="form-label">Detalles Adicionales o Fecha Estimada</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Cuéntenos más sobre su evento, precios deseados o requerimientos de taquilla..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  Enviar Solicitud de Registro <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

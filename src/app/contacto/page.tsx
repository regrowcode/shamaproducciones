"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Award,
  Radio,
  ExternalLink,
} from "lucide-react";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    tipo: "soporte",
    mensaje: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contacto-page-wrap">
      <div className="contacto-page-inner">
        {/* Breadcrumb & Header */}
        <div className="contacto-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "#64748b", marginBottom: "8px" }}>
            <Link href="/" style={{ color: "#0047cc", fontWeight: 600 }}>Inicio</Link>
            <span>/</span>
            <span style={{ color: "#0f172a", fontWeight: 600 }}>Contáctenos</span>
          </div>
          <h1 className="contacto-title">Centro de Contacto & Atención al Cliente</h1>
          <p className="contacto-subtitle">
            Estamos en Barquisimeto, Venezuela para brindarte soporte en tus compras, resolver tus consultas y conectar con organizadores de eventos.
          </p>
        </div>

        {/* 2-Column Contact Info + PQRS Form */}
        <div className="contacto-layout-grid">
          {/* ================= LEFT COLUMN: INFO CARDS ================= */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="contacto-info-card">
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                Información de Nuestra Sede
              </h2>

              {/* Sede Barquisimeto */}
              <div className="contacto-item-row">
                <div className="contacto-icon-circle">
                  <MapPin size={20} />
                </div>
                <div>
                  <strong style={{ display: "block", color: "#0f172a", fontSize: "0.95rem" }}>Sede Principal</strong>
                  <span style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: "1.4", display: "block" }}>
                    Barquisimeto, Estado Lara, Venezuela.
                  </span>
                  <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                    Av. Los Leones, Centro Empresarial Barquisimeto
                  </span>
                </div>
              </div>

              {/* WhatsApp / Teléfono */}
              <div className="contacto-item-row">
                <div className="contacto-icon-circle" style={{ background: "#ecfdf5", color: "#059669" }}>
                  <Phone size={20} />
                </div>
                <div>
                  <strong style={{ display: "block", color: "#0f172a", fontSize: "0.95rem" }}>Atención Telefónica & WhatsApp</strong>
                  <a
                    href="https://wa.me/584121234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#059669", fontWeight: 700, fontSize: "0.95rem", textDecoration: "underline" }}
                  >
                    +58 (412) 123-4567
                  </a>
                  <span style={{ display: "block", color: "#64748b", fontSize: "0.8rem", marginTop: "2px" }}>
                    Respuesta rápida para validación de boletos y dudas
                  </span>
                </div>
              </div>

              {/* Correo Electrónico */}
              <div className="contacto-item-row">
                <div className="contacto-icon-circle" style={{ background: "#eef2ff", color: "#4f46e5" }}>
                  <Mail size={20} />
                </div>
                <div>
                  <strong style={{ display: "block", color: "#0f172a", fontSize: "0.95rem" }}>Correo Electrónico</strong>
                  <a
                    href="mailto:contacto@shamaproducciones.com"
                    style={{ color: "#0047cc", fontSize: "0.9rem", textDecoration: "underline" }}
                  >
                    contacto@shamaproducciones.com
                  </a>
                </div>
              </div>

              {/* Horario */}
              <div className="contacto-item-row" style={{ marginBottom: 0 }}>
                <div className="contacto-icon-circle" style={{ background: "#fffbeb", color: "#d97706" }}>
                  <Clock size={20} />
                </div>
                <div>
                  <strong style={{ display: "block", color: "#0f172a", fontSize: "0.95rem" }}>Horario de Atención</strong>
                  <span style={{ color: "#64748b", fontSize: "0.88rem", display: "block" }}>
                    Lunes a Sábado: 8:30 AM a 6:00 PM
                  </span>
                  <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                    Días de evento: Soporte activo hasta finalizar la jornada
                  </span>
                </div>
              </div>
            </div>

            {/* Organizer Banner */}
            <div
              style={{
                background: "linear-gradient(135deg, #0047cc 0%, #0f172a 100%)",
                borderRadius: "16px",
                padding: "26px",
                color: "#ffffff",
                boxShadow: "0 6px 18px rgba(0, 71, 204, 0.2)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  background: "#fef08a",
                  color: "#0f172a",
                  fontSize: "0.75rem",
                  fontWeight: 900,
                  padding: "3px 8px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: "12px",
                }}
              >
                ¿Eres Productor u Organizador?
              </span>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "8px" }}>
                Vende tu evento con Shama
              </h3>
              <p style={{ fontSize: "0.86rem", color: "rgba(255,255,255,0.85)", lineHeight: "1.4", marginBottom: "16px" }}>
                Publica tus conferencias, conciertos o talleres con liquidación bancaria directa, cobro en Pago Móvil, Bs y Cripto.
              </p>
              <Link
                href="/venda-su-evento"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  background: "#ffffff",
                  color: "#0047cc",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <span>Conocer plataforma para eventos</span>
                <ExternalLink size={15} />
              </Link>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: PQRS / SUPPORT FORM ================= */}
          <div>
            <div className="contacto-form-box">
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "#ecfdf5",
                      color: "#16a34a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <CheckCircle2 size={34} />
                  </div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
                    ¡Solicitud enviada con éxito!
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "0.92rem", maxWidth: "440px", margin: "0 auto 24px", lineHeight: "1.5" }}>
                    Hemos recibido tu mensaje en nuestra sede de Barquisimeto. Un agente de soporte te responderá vía correo o WhatsApp en menos de 24 horas.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ nombre: "", correo: "", telefono: "", tipo: "soporte", mensaje: "" });
                    }}
                    className="contacto-submit-btn"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <MessageSquare size={20} style={{ color: "#0047cc" }} />
                    <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a" }}>
                      Envíanos un mensaje o solicitud (PQRS)
                    </h2>
                  </div>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "22px" }}>
                    Completa los datos a continuación y nos pondremos en contacto contigo de inmediato.
                  </p>

                  <div className="contacto-form-grid">
                    <div className="contacto-field-group">
                      <label>Nombre y Apellido *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Carlos Mendoza"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        id="contacto-nombre"
                      />
                    </div>

                    <div className="contacto-field-group">
                      <label>Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        placeholder="tu@correo.com"
                        value={formData.correo}
                        onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                        id="contacto-correo"
                      />
                    </div>
                  </div>

                  <div className="contacto-form-grid">
                    <div className="contacto-field-group">
                      <label>Teléfono / WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="Ej: 0412-1234567"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        id="contacto-telefono"
                      />
                    </div>

                    <div className="contacto-field-group">
                      <label>Tipo de Solicitud *</label>
                      <select
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                        id="contacto-tipo"
                      >
                        <option value="soporte">Soporte con mi Boleto / Compra</option>
                        <option value="evento">Información sobre un Evento</option>
                        <option value="pqrs">Petición, Queja o Reclamo (PQRS)</option>
                        <option value="productor">Alianza / Producción de Eventos</option>
                        <option value="otro">Otro Asunto</option>
                      </select>
                    </div>
                  </div>

                  <div className="contacto-field-group">
                    <label>Mensaje o Detalle del Requerimiento *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Escribe aquí tu consulta detallada (si es sobre una orden existente, incluye el número de compra o cédula)..."
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      id="contacto-mensaje"
                    />
                  </div>

                  <button type="submit" className="contacto-submit-btn" id="btn-enviar-contacto">
                    <Send size={16} />
                    <span>Enviar Mensaje</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ================= SECTION: ACERCA DE NOSOTROS ================= */}
        <section id="nosotros" className="about-us-container">
          <div style={{ maxWidth: "780px" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 900,
                color: "#0047cc",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Conoce Nuestra Productora
            </span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#0f172a", marginBottom: "14px" }}>
              Acerca de Shama Producciones & Tiquetera
            </h2>
            <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "12px" }}>
              <strong>Shama Producciones</strong> nació en <strong>Barquisimeto, Venezuela</strong> con el propósito de revolucionar la gestión y difusión de eventos presenciales y virtuales en todo el país. Como productora integral y plataforma de boletería digital, combinamos producción técnica audiovisual de alto nivel (sonido Line Array, pantallas LED, circuito cerrado) con una solución de ticketing online 100% automatizada.
            </p>
            <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: "1.6" }}>
              Eliminamos las filas y la necesidad de boletos de papel físicos mediante códigos QR inviolables y dinámicos, permitiendo a los asistentes pagar de manera rápida y transparente en Bolívares (a través de Pago Móvil y transferencia) o criptomonedas (USDT), garantizando total seguridad tanto para el espectador como para el organizador.
            </p>
          </div>

          <div className="about-features-grid">
            <div className="about-feature-box">
              <div style={{ color: "#0047cc", marginBottom: "10px" }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>
                Boletería Digital Certificada
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: "1.4" }}>
                Emisión instantánea con código QR inviolable, validación en tiempo real en los accesos y resguardo anti-fraude.
              </p>
            </div>

            <div className="about-feature-box">
              <div style={{ color: "#059669", marginBottom: "10px" }}>
                <Radio size={28} />
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>
                Eventos Presenciales y Streaming
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: "1.4" }}>
                Capacidad de transmisión en vivo en Full HD/4K con enlaces únicos y salas privadas para seminarios y congresos.
              </p>
            </div>

            <div className="about-feature-box">
              <div style={{ color: "#d97706", marginBottom: "10px" }}>
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>
                Sello de Calidad Barquisimeto
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: "1.4" }}>
                Equipo técnico profesional, soporte humano directo y presencia activa en los principales recintos y teatros del país.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

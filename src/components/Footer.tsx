"use client";

import React from "react";
import Link from "next/link";
import { Ticket, ShieldCheck, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="clean-footer">
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "36px", marginBottom: "40px" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", color: "#ffffff", fontWeight: 800, fontSize: "1.2rem" }}>
              <div style={{ width: "30px", height: "30px", background: "var(--primary-blue)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
                <Ticket size={18} />
              </div>
              <span>SHAMA TIQUETERA</span>
            </div>
            <p style={{ fontSize: "0.88rem", lineHeight: "1.6", color: "#94a3b8", marginBottom: "16px" }}>
              Tiquetera oficial y boletería digital para conferencias, masterclasses, conciertos y seminarios en Venezuela. Boletos 100% digitales con QR criptográfico.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.82rem", color: "#cbd5e1" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={14} color="var(--primary-blue)" /> Caracas y Valencia, Venezuela
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Phone size={14} color="var(--primary-blue)" /> +58 (412) 123-4567
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Mail size={14} color="var(--primary-blue)" /> boleteria@shamaproducciones.com
              </span>
            </div>
          </div>

          {/* Categorías */}
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "0.95rem", fontWeight: 700, marginBottom: "14px" }}>
              Categorías de Eventos
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.88rem" }}>
              <li>
                <Link href="/eventos?cat=conferencia">Conferencias de Cine & Producción</Link>
              </li>
              <li>
                <Link href="/eventos?cat=masterclass">Masterclasses Técnicas</Link>
              </li>
              <li>
                <Link href="/eventos?cat=taller">Talleres y Workshops Prácticos</Link>
              </li>
              <li>
                <Link href="/eventos?cat=seminario">Seminarios en Streaming Online</Link>
              </li>
            </ul>
          </div>

          {/* Canales de Pago en Venezuela */}
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "0.95rem", fontWeight: 700, marginBottom: "14px" }}>
              Métodos de Pago Aceptados
            </h4>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "12px" }}>
              Pagos en Bolívares a tasa oficial BCV y Criptomonedas:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              <span className="badge badge-gold">Pago Móvil</span>
              <span className="badge badge-gold">Banco Mercantil</span>
              <span className="badge badge-gold">Banesco</span>
              <span className="badge badge-gold">BDV</span>
              <span className="badge badge-gold">Banplus</span>
              <span className="badge badge-online">Binance Pay</span>
              <span className="badge badge-online">USDT</span>
            </div>
          </div>

          {/* Información y Soporte */}
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "0.95rem", fontWeight: 700, marginBottom: "14px" }}>
              Atención al Cliente
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.88rem" }}>
              <li>
                <Link href="/mis-boletos">Consultar Mis Boletos</Link>
              </li>
              <li>
                <Link href="/login">Acceso de Compradores</Link>
              </li>
              <li>
                <a href="https://wa.me/584121234567" target="_blank" rel="noopener noreferrer">
                  Soporte WhatsApp Directo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", fontSize: "0.8rem", color: "#64748b" }}>
          <div>© 2026 Shama Producciones. Todos los derechos reservados.</div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8" }}>
            <ShieldCheck size={16} color="#16a34a" />
            <span>Plataforma de Boletos Segura con Cifrado QR Anti-Fraude</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

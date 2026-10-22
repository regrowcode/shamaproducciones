"use client";

import React from "react";
import Link from "next/link";
import { Clapperboard, ShieldCheck, QrCode, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand info */}
          <div>
            <div className="logo-wrap" style={{ marginBottom: "16px" }}>
              <div className="logo-badge">
                <Clapperboard size={20} />
              </div>
              <div>
                <span style={{ color: "#ffffff", fontWeight: 800 }}>SHAMA</span>
                <span style={{ color: "var(--accent-gold)", fontWeight: 400, marginLeft: "4px" }}>PRODUCCIONES</span>
              </div>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6", maxWidth: "340px", marginBottom: "20px" }}>
              Productora audiovisual y de eventos de alta envergadura. Conferencias, talleres y seminarios con tiquetera 100% digital y pagos en Venezuela.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin size={16} color="var(--accent-gold)" /> Caracas & Valencia, Venezuela
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Mail size={16} color="var(--accent-gold)" /> contacto@shamaproducciones.com
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Phone size={16} color="var(--accent-gold)" /> +58 (412) 123-4567
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="footer-title">Plataforma</h4>
            <ul className="footer-links">
              <li>
                <Link href="/eventos">Todos los Eventos</Link>
              </li>
              <li>
                <Link href="/validador">Validador de Boletos (Staff)</Link>
              </li>
              <li>
                <Link href="/admin">Panel de Administración</Link>
              </li>
              <li>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Importador E-commerce <em style={{ color: "var(--accent-gold)" }}>(Fase 2)</em>
                </span>
              </li>
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h4 className="footer-title">Categorías</h4>
            <ul className="footer-links">
              <li>
                <Link href="/eventos?cat=conferencia">Conferencias de Cine</Link>
              </li>
              <li>
                <Link href="/eventos?cat=masterclass">Masterclasses en Vivo</Link>
              </li>
              <li>
                <Link href="/eventos?cat=seminario">Seminarios Online HD</Link>
              </li>
              <li>
                <Link href="/eventos?cat=taller">Workshops Intensivos</Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods Venezuela */}
          <div>
            <h4 className="footer-title">Métodos de Pago</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "14px" }}>
              Pagos en Bolívares y Cripto sin comisiones intermedias:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <span className="badge badge-gold">Pago Móvil</span>
              <span className="badge badge-gold">Banesco</span>
              <span className="badge badge-gold">Mercantil</span>
              <span className="badge badge-gold">BDV</span>
              <span className="badge badge-gold">Banplus</span>
              <span className="badge badge-online">Binance Pay</span>
              <span className="badge badge-online">USDT</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="footer-bottom">
          <p>© 2026 Shama Producciones. Todos los derechos reservados.</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldCheck size={16} color="var(--status-success)" />
            <span>Tiquetera Digital con Cifrado Criptográfico Anti-Fraude</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

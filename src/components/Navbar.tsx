"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, QrCode, ShieldCheck, Ticket, Menu, X, ArrowUpRight } from "lucide-react";
import { useCurrency } from "./CurrencyContext";

export default function Navbar() {
  const pathname = usePathname();
  const { currency, setCurrency, rate } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link href="/" className="logo-wrap" id="brand-logo">
          <div className="logo-badge">
            <Clapperboard size={20} />
          </div>
          <div>
            <span style={{ color: "#ffffff", fontWeight: 800 }}>SHAMA</span>
            <span style={{ color: "var(--accent-gold)", fontWeight: 400, marginLeft: "4px" }}>PRODUCCIONES</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="nav-links">
          <Link href="/" className={`nav-link ${isActive("/") ? "active" : ""}`} id="nav-home">
            Inicio
          </Link>
          <Link href="/eventos" className={`nav-link ${isActive("/eventos") ? "active" : ""}`} id="nav-events">
            Eventos & Boletos
          </Link>
          <Link href="/validador" className={`nav-link ${isActive("/validador") ? "active" : ""}`} id="nav-validator">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <QrCode size={16} /> Validador Puerta
            </span>
          </Link>
          <Link href="/admin" className={`nav-link ${isActive("/admin") ? "active" : ""}`} id="nav-admin">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={16} /> Panel Admin
            </span>
          </Link>
        </nav>

        {/* Actions & Currency Switcher */}
        <div className="nav-actions">
          {/* Currency Toggle */}
          <div className="currency-pill" title={`Tasa oficial BCV: ${rate} Bs/USD`}>
            <button
              type="button"
              className={`currency-option ${currency === "USD" ? "active" : ""}`}
              onClick={() => setCurrency("USD")}
              id="currency-usd-btn"
            >
              USD $
            </button>
            <button
              type="button"
              className={`currency-option ${currency === "VES" ? "active" : ""}`}
              onClick={() => setCurrency("VES")}
              id="currency-ves-btn"
            >
              Bs.
            </button>
          </div>

          <Link href="/eventos" className="btn btn-primary btn-sm" id="cta-tickets">
            <Ticket size={16} /> Comprar Boletos
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ display: "none" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir Menú"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

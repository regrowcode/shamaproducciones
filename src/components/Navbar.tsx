"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ticket,
  User as UserIcon,
  LogOut,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { useCurrency } from "./CurrencyContext";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { currency, setCurrency, rate } = useCurrency();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Top Utility Bar (La Tiquetera style) */}
      <div className="top-utility-bar">
        <div className="container top-bar-inner">
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
              🇻🇪 <strong>Venezuela</strong>
            </span>
            <span style={{ color: "#64748b" }}>|</span>
            <span>
              Tasa Oficial BCV: <strong style={{ color: "#f8fafc" }}>{rate} Bs/USD</strong>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a
              href="https://wa.me/584121234567"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#e2e8f0" }}
            >
              <MessageCircle size={13} color="#22c55e" /> Soporte WhatsApp
            </a>

            {/* Currency Pill */}
            <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.12)", borderRadius: "4px", padding: "2px" }}>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                style={{
                  padding: "2px 8px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  borderRadius: "3px",
                  background: currency === "USD" ? "#ffffff" : "transparent",
                  color: currency === "USD" ? "#0f172a" : "#cbd5e1",
                }}
                id="btn-curr-usd"
              >
                USD $
              </button>
              <button
                type="button"
                onClick={() => setCurrency("VES")}
                style={{
                  padding: "2px 8px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  borderRadius: "3px",
                  background: currency === "VES" ? "#ffffff" : "transparent",
                  color: currency === "VES" ? "#0f172a" : "#cbd5e1",
                }}
                id="btn-curr-ves"
              >
                Bs.
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="main-navbar">
        <div className="container main-navbar-inner">
          {/* Logo */}
          <Link href="/" className="brand-logo-wrap" id="site-logo">
            <div className="brand-icon-box">
              <Ticket size={22} />
            </div>
            <div>
              <span style={{ letterSpacing: "-0.03em" }}>SHAMA</span>
              <span style={{ fontWeight: 400, marginLeft: "4px", fontSize: "1.1rem", opacity: 0.9 }}>
                TIQUETERA
              </span>
            </div>
          </Link>

          {/* Categories Nav (La Tiquetera style) */}
          <nav className="nav-category-links">
            <Link href="/" className={`nav-cat-link ${isActive("/") ? "active" : ""}`}>
              Inicio
            </Link>
            <Link href="/eventos" className={`nav-cat-link ${isActive("/eventos") ? "active" : ""}`}>
              Todos los Eventos
            </Link>
            <Link href="/eventos?cat=conferencia" className="nav-cat-link">
              Conferencias
            </Link>
            <Link href="/eventos?cat=masterclass" className="nav-cat-link">
              Masterclasses
            </Link>
            <Link href="/eventos?cat=taller" className="nav-cat-link">
              Talleres
            </Link>
          </nav>

          {/* User Auth Menu */}
          <div className="nav-auth-actions">
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Link
                  href="/mis-boletos"
                  className="btn btn-outline-white btn-sm"
                  id="nav-my-tickets"
                >
                  <Ticket size={15} /> Mis Boletos
                </Link>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(255,255,255,0.12)",
                    padding: "5px 12px",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                  }}
                >
                  <UserIcon size={14} />
                  <span style={{ fontWeight: 600 }}>{user.fullName.split(" ")[0]}</span>
                  <button
                    type="button"
                    onClick={logout}
                    title="Cerrar sesión"
                    style={{ marginLeft: "4px", color: "rgba(255,255,255,0.7)" }}
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Link href="/login" className="btn btn-outline-white btn-sm" id="nav-login">
                  Iniciar Sesión
                </Link>
                <Link href="/registro" className="btn btn-primary btn-sm" style={{ background: "#ffffff", color: "var(--primary-blue)" }} id="nav-register">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

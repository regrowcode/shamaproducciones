"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Ticket,
  Search,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/eventos?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <header className="main-navbar">
      <div className="container main-navbar-inner" style={{ height: "72px" }}>
        {/* Brand Logo */}
        <Link href="/" className="brand-logo-wrap" id="brand-logo">
          <div className="brand-icon-box" style={{ background: "#ffffff", color: "var(--primary-blue)" }}>
            <Ticket size={22} />
          </div>
          <div>
            <span style={{ fontWeight: 900, letterSpacing: "-0.03em" }}>SHAMA</span>
            <span style={{ fontWeight: 400, marginLeft: "4px", fontSize: "1rem", opacity: 0.9 }}>
              TIQUETERA
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="nav-category-links" style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <Link href="/" className={`nav-cat-link ${isActive("/") ? "active" : ""}`} id="nav-inicio">
            Inicio
          </Link>
          <Link href="/eventos" className={`nav-cat-link ${isActive("/eventos") ? "active" : ""}`} id="nav-eventos">
            Eventos
          </Link>
          <a
            href="https://business.latiquetera.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cat-link"
            style={{ color: "#fef08a", fontWeight: 700 }}
            id="nav-venda-evento"
          >
            Venda su Evento
          </a>
          <Link href="/contacto" className={`nav-cat-link ${isActive("/contacto") ? "active" : ""}`} id="nav-contacto">
            Contáctenos
          </Link>
        </nav>

        {/* Integrated Header Search Form */}
        <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", position: "relative", maxWidth: "260px", flex: 1, margin: "0 16px" }}>
          <input
            type="text"
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 34px 7px 12px",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              background: "rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              fontSize: "0.85rem",
              outline: "none",
            }}
            id="header-search-input"
          />
          <button
            type="submit"
            style={{ position: "absolute", right: "10px", color: "rgba(255, 255, 255, 0.8)", cursor: "pointer" }}
            aria-label="Buscar"
          >
            <Search size={15} />
          </button>
        </form>

        {/* Auth Buttons */}
        <div className="nav-auth-actions">
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link href="/mis-boletos" className="btn btn-outline-white btn-sm" id="btn-mis-boletos">
                <Ticket size={14} /> Mis Boletos
              </Link>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(255, 255, 255, 0.15)",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                }}
              >
                <UserIcon size={14} />
                <span>{user.fullName.split(" ")[0]}</span>
                <button
                  type="button"
                  onClick={logout}
                  title="Cerrar sesión"
                  style={{ marginLeft: "4px", color: "#cbd5e1" }}
                >
                  <LogOut size={13} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link href="/login" className="btn btn-outline-white btn-sm" id="btn-header-login">
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="btn btn-sm"
                style={{ background: "#ffffff", color: "var(--primary-blue)", fontWeight: 700 }}
                id="btn-header-register"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

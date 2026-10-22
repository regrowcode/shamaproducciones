"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Ticket,
  Search,
  MapPin,
  Calendar,
  LayoutGrid,
  User as UserIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Search filter states
  const [query, setQuery] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [fecha, setFecha] = useState("");
  const [categoria, setCategoria] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (ciudad) params.set("ciudad", ciudad);
    if (fecha) params.set("fecha", fecha);
    if (categoria) params.set("cat", categoria);

    const queryString = params.toString();
    router.push(`/eventos${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <header className="full-header" id="main-header">
      <div className="full-header-container">
        {/* ================= TOP ROW: BRAND & NAVIGATION ================= */}
        <div className="full-header-top">
          {/* Logo brand */}
          <Link href="/" className="brand-logo-wrap" id="header-brand-logo" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#0047cc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              <Ticket size={22} />
            </div>
            <div style={{ lineHeight: "1.1" }}>
              <span style={{ fontSize: "1.35rem", fontWeight: 900, letterSpacing: "-0.03em", color: "#ffffff" }}>
                shama
              </span>
              <span style={{ fontSize: "1.1rem", fontWeight: 400, marginLeft: "4px", color: "rgba(255,255,255,0.85)" }}>
                tiquetera
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="full-header-nav" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link href="/eventos" className="full-header-nav-link" id="nav-eventos">
              Eventos
            </Link>

            <Link href="/contacto#nosotros" className="full-header-nav-link" id="nav-acerca-nosotros">
              Acerca de nosotros
            </Link>

            <Link
              href="/venda-su-evento"
              className="full-header-nav-link"
              style={{ color: "#fef08a", fontWeight: 800 }}
              id="nav-venda-su-evento"
            >
              Venda su evento
            </Link>

            {/* Auth section */}
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Link
                  href="/mis-boletos"
                  className="full-header-nav-link"
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                  id="nav-mis-boletos"
                >
                  <Ticket size={16} />
                  <span>Mis Boletos</span>
                </Link>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(255,255,255,0.15)",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                  }}
                >
                  <UserIcon size={14} />
                  <span>{user.fullName.split(" ")[0]}</span>
                  <button
                    type="button"
                    onClick={logout}
                    title="Cerrar sesión"
                    style={{ color: "rgba(255,255,255,0.75)", cursor: "pointer", marginLeft: "4px" }}
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                <Link href="/login" className="full-header-nav-link" id="nav-iniciar-sesion">
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  className="full-header-nav-link"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                  id="nav-registrar"
                >
                  Registrar
                </Link>
              </div>
            )}

            {/* Language Selector Indicator */}
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#ffffff",
                padding: "3px 8px",
                border: "1px solid rgba(255,255,255,0.4)",
                borderRadius: "4px",
                userSelect: "none",
              }}
            >
              ES
            </span>

            {/* Mobile menu hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center" }}
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>

        {/* ================= BOTTOM ROW: MULTI-SEGMENT SEARCH BAR (MATCHING PHOTO) ================= */}
        <form onSubmit={handleSearch} className="search-segmented-bar" id="header-search-bar">
          {/* Segmento 1: Texto de búsqueda */}
          <div className="search-segment search-segment-main">
            <Search size={17} style={{ color: "#64748b", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Buscar por evento, artista o lugar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              id="search-input-query"
            />
          </div>

          {/* Segmento 2: Ciudad */}
          <div className="search-segment search-segment-select">
            <MapPin size={16} style={{ color: "#64748b", flexShrink: 0 }} />
            <select
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              id="search-select-city"
            >
              <option value="">Cualquier ciudad</option>
              <option value="Barquisimeto">Barquisimeto (Lara)</option>
              <option value="Caracas">Caracas</option>
              <option value="Valencia">Valencia</option>
              <option value="Maracaibo">Maracaibo</option>
              <option value="Online">Online / Streaming</option>
            </select>
          </div>

          {/* Segmento 3: Fecha */}
          <div className="search-segment search-segment-select">
            <Calendar size={16} style={{ color: "#64748b", flexShrink: 0 }} />
            <select
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              id="search-select-date"
            >
              <option value="">Cualquier fecha</option>
              <option value="fin-de-semana">Este fin de semana</option>
              <option value="este-mes">Este mes</option>
              <option value="proximamente">Próximos eventos 2026</option>
            </select>
          </div>

          {/* Segmento 4: Categoría */}
          <div className="search-segment search-segment-select">
            <LayoutGrid size={16} style={{ color: "#64748b", flexShrink: 0 }} />
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              id="search-select-category"
            >
              <option value="">Cualquier categoría</option>
              <option value="conferencia">Conferencias</option>
              <option value="concierto">Conciertos</option>
              <option value="taller">Talleres</option>
              <option value="seminario">Seminarios</option>
              <option value="festival">Festivales</option>
            </select>
          </div>

          {/* Segmento 5: Botón Buscar */}
          <button type="submit" className="search-btn-primary" id="btn-search-submit">
            Buscar
          </button>
        </form>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div
            style={{
              background: "#0036a3",
              borderRadius: "8px",
              marginTop: "12px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Link
              href="/eventos"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: "#ffffff", fontWeight: 700 }}
            >
              Eventos
            </Link>
            <Link
              href="/contacto#nosotros"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: "#ffffff", fontWeight: 700 }}
            >
              Acerca de nosotros
            </Link>
            <Link
              href="/venda-su-evento"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: "#fef08a", fontWeight: 800 }}
            >
              Venda su evento
            </Link>
            <Link
              href="/contacto"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: "#ffffff", fontWeight: 700 }}
            >
              Contáctenos
            </Link>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "10px" }}>
              {user ? (
                <>
                  <Link
                    href="/mis-boletos"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: "#ffffff", display: "block", marginBottom: "8px" }}
                  >
                    Mis Boletos
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    style={{ color: "#fca5a5", fontWeight: 600 }}
                  >
                    Cerrar Sesión ({user.fullName})
                  </button>
                </>
              ) : (
                <div style={{ display: "flex", gap: "10px" }}>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: "#ffffff", fontWeight: 700 }}
                  >
                    Iniciar sesión
                  </Link>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>|</span>
                  <Link
                    href="/registro"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: "#fef08a", fontWeight: 700 }}
                  >
                    Registrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

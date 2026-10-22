"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Calendar, MapPin, Video, Sparkles } from "lucide-react";
import { SHAMA_EVENTS } from "@/lib/data";
import EventCard from "@/components/EventCard";

export default function EventosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedFormat, setSelectedFormat] = useState("todos");

  const filteredEvents = useMemo(() => {
    return SHAMA_EVENTS.filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.speakers.some((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCat = selectedCategory === "todas" || e.category === selectedCategory;
      const matchFormat = selectedFormat === "todos" || e.format === selectedFormat;

      return matchSearch && matchCat && matchFormat;
    });
  }, [searchTerm, selectedCategory, selectedFormat]);

  return (
    <div style={{ padding: "40px 0 80px" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 40px" }}>
          <span className="badge badge-gold" style={{ marginBottom: "10px" }}>
            <Sparkles size={14} /> Calendario & Tiquetera Oficial
          </span>
          <h1 style={{ fontSize: "2.6rem", fontWeight: 800, marginBottom: "14px" }}>
            Cartelera de Eventos Shama
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
            Elige tu conferencia, masterclass o seminario. Selecciona tu tipo de entrada y paga fácilmente en Bolívares o Criptomonedas.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div
          className="glass-panel"
          style={{
            padding: "20px 24px",
            marginBottom: "36px",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Search bar */}
          <div style={{ position: "relative", flex: "1 1 300px" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Buscar por título, ciudad o ponente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "42px" }}
              id="events-search-input"
            />
          </div>

          {/* Category Select */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
              style={{ width: "auto" }}
              id="filter-category-select"
            >
              <option value="todas">Todas las categorías</option>
              <option value="conferencia">Conferencias</option>
              <option value="masterclass">Masterclasses</option>
              <option value="seminario">Seminarios</option>
              <option value="taller">Talleres & Workshops</option>
            </select>

            {/* Format Select */}
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="form-select"
              style={{ width: "auto" }}
              id="filter-format-select"
            >
              <option value="todos">Todos los formatos</option>
              <option value="presencial">Presencial (Caracas / Valencia)</option>
              <option value="online">Streaming Online HD</option>
              <option value="hibrido">Híbrido (Ambos)</option>
            </select>
          </div>
        </div>

        {/* Results counter */}
        <div style={{ marginBottom: "24px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Mostrando <strong>{filteredEvents.length}</strong> eventos disponibles
        </div>

        {/* Grid */}
        {filteredEvents.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        ) : (
          <div
            className="card"
            style={{
              padding: "60px 20px",
              textAlign: "center",
              background: "var(--bg-surface)",
            }}
          >
            <Calendar size={48} color="var(--accent-gold)" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: "1.4rem", marginBottom: "8px" }}>No se encontraron eventos</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
              Intenta cambiar los términos de búsqueda o los filtros seleccionados.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("todas");
                setSelectedFormat("todos");
              }}
            >
              Restablecer Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

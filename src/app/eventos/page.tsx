"use client";

import React, { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, Filter, Sparkles } from "lucide-react";
import { filterEvents } from "@/lib/services/event-service";
import EventSearchRibbon from "@/components/EventSearchRibbon";
import EventCard from "@/components/EventCard";

function EventosContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const city = searchParams.get("ciudad") || searchParams.get("city") || "";
  const cat = searchParams.get("cat") || searchParams.get("categoria") || "";

  const filteredEvents = useMemo(() => {
    return filterEvents({
      search: q,
      city,
      category: cat,
    });
  }, [q, city, cat]);

  return (
    <div>
      <EventSearchRibbon initialSearch={q} initialCity={city} initialCategory={cat} />

      <div style={{ padding: "40px 0 80px" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Todos los Eventos & Cartelera
              </h1>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                Mostrando <strong>{filteredEvents.length}</strong> eventos disponibles
                {city ? ` en ${city}` : ""}
                {cat ? ` de ${cat}` : ""}
              </p>
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="events-clean-grid">
              {filteredEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          ) : (
            <div
              className="clean-event-card"
              style={{
                padding: "60px 20px",
                textAlign: "center",
                maxWidth: "500px",
                margin: "40px auto",
              }}
            >
              <Calendar size={48} color="#94a3b8" style={{ margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "8px" }}>
                No encontramos eventos con esos filtros
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "20px" }}>
                Intenta buscar en otra ciudad o con una categoría diferente.
              </p>
              <a href="/eventos" className="btn btn-secondary btn-sm">
                Ver todos los eventos
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EventosPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: "80px 0", textAlign: "center" }}>Cargando cartelera...</div>}>
      <EventosContent />
    </Suspense>
  );
}

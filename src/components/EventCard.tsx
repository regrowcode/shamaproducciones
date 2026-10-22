"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Video, ArrowRight } from "lucide-react";
import { ShamaEvent } from "@/lib/types";
import { useCurrency } from "./CurrencyContext";

interface EventCardProps {
  event: ShamaEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const { formatPrice } = useCurrency();

  const minPrice = Math.min(...event.tiers.map((t) => t.priceUsd));
  const priceDisplay = formatPrice(minPrice);

  return (
    <article className="clean-event-card" id={`event-card-${event.slug}`}>
      {/* Banner */}
      <div className="clean-card-banner">
        <Image
          src={event.bannerUrl}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="clean-card-img"
        />

        {/* Date chip */}
        <div className="clean-card-date-badge">
          <Calendar size={14} color="var(--primary-blue)" />
          <span>{event.date}</span>
        </div>

        {/* Format badge overlay */}
        <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
          {event.format === "presencial" && <span className="badge badge-presencial">Presencial</span>}
          {event.format === "online" && <span className="badge badge-online">Online HD</span>}
          {event.format === "hibrido" && <span className="badge badge-hibrido">Híbrido</span>}
        </div>
      </div>

      {/* Body */}
      <div className="clean-card-body">
        <h3 className="clean-card-title">{event.title}</h3>

        <div className="clean-card-meta">
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <MapPin size={14} color="#64748b" /> {event.location.split("(")[0].trim()}, {event.city.split(",")[0].trim()}
          </span>
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {event.subtitle}
        </p>

        {/* Card Footer */}
        <div className="clean-card-footer">
          <div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>
              Desde
            </span>
            <div className="clean-card-price-main">{priceDisplay.main}</div>
            <div className="clean-card-price-sub">{priceDisplay.secondary}</div>
          </div>

          <Link href={`/eventos/${event.slug}`} className="btn btn-primary btn-sm" id={`btn-buy-${event.slug}`}>
            Comprar <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

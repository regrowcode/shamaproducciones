"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin, Users, ArrowRight, Video } from "lucide-react";
import { ShamaEvent } from "@/lib/types";
import { useCurrency } from "./CurrencyContext";

interface EventCardProps {
  event: ShamaEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const { formatPrice } = useCurrency();

  // Determine starting price from the lowest tier
  const minPrice = Math.min(...event.tiers.map((t) => t.priceUsd));
  const priceDisplay = formatPrice(minPrice);

  // Calculate total sold percentage
  const totalCapacity = event.tiers.reduce((acc, t) => acc + t.capacity, 0);
  const totalSold = event.tiers.reduce((acc, t) => acc + t.sold, 0);
  const percentSold = Math.round((totalSold / totalCapacity) * 100);

  return (
    <article className="event-card" id={`event-card-${event.slug}`}>
      <div className="event-banner-wrap">
        <Image
          src={event.bannerUrl}
          alt={event.title}
          width={600}
          height={300}
          className="event-banner-img"
          loading="lazy"
        />

        {/* Badges on top of image */}
        <div className="event-badge-overlay">
          {event.format === "presencial" && (
            <span className="badge badge-presencial">
              <MapPin size={12} /> Presencial
            </span>
          )}
          {event.format === "online" && (
            <span className="badge badge-online">
              <Video size={12} /> Streaming Online
            </span>
          )}
          {event.format === "hibrido" && (
            <span className="badge badge-hibrido">
              <Users size={12} /> Híbrido
            </span>
          )}
          <span className="badge badge-gold" style={{ textTransform: "capitalize" }}>
            {event.category}
          </span>
        </div>

        {/* Date chip */}
        <div className="event-date-chip">
          <Calendar size={13} style={{ display: "inline", marginRight: "5px", color: "var(--accent-gold)" }} />
          {event.date}
        </div>
      </div>

      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-sub">{event.subtitle}</p>

        {/* Meta info */}
        <div className="event-meta-row">
          <div className="event-meta-item">
            <Clock size={15} color="var(--accent-gold)" />
            <span>{event.time}</span>
          </div>
          <div className="event-meta-item">
            <MapPin size={15} color="var(--accent-gold)" />
            <span>{event.city}</span>
          </div>
        </div>

        {/* Capacity / Scarcity progress indicator */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            <span>Disponibilidad de cupos</span>
            <span style={{ fontWeight: 600, color: percentSold > 80 ? "var(--status-error)" : "var(--accent-gold)" }}>
              {percentSold}% reservados
            </span>
          </div>
          <div style={{ width: "100%", height: "6px", background: "var(--bg-elevated)", borderRadius: "3px", overflow: "hidden" }}>
            <div
              style={{
                width: `${percentSold}%`,
                height: "100%",
                background: percentSold > 80 ? "linear-gradient(90deg, #f59e0b, #ef4444)" : "linear-gradient(90deg, #10b981, #f59e0b)",
                borderRadius: "3px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Card Footer */}
        <div className="event-footer-row">
          <div className="event-price-box">
            <span className="event-price-label">Desde</span>
            <span className="event-price-main">{priceDisplay.main}</span>
            <span className="event-price-bs">{priceDisplay.secondary}</span>
          </div>

          <Link href={`/eventos/${event.slug}`} className="btn btn-primary btn-sm" id={`btn-view-${event.slug}`}>
            Reservar <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShamaEvent } from "@/lib/types";

interface EventCardProps {
  event: ShamaEvent;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/eventos/${event.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      className="latiquetera-card"
      id={`event-card-${event.slug}`}
    >
      {/* Event Poster Image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#e2e8f0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Image
          src={event.bannerUrl}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
        />

        {event.format === "online" && (
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              right: "8px",
              background: "#2563eb",
              color: "#ffffff",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: "4px",
              textTransform: "uppercase",
            }}
          >
            Online HD
          </div>
        )}
      </div>

      {/* Info below photo (Matching Photo 1) */}
      <div style={{ paddingTop: "12px", display: "flex", flexDirection: "column", gap: "3px" }}>
        {/* Title */}
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: "1.3",
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {event.title}
        </h3>

        {/* Date */}
        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
          {event.date}
        </div>

        {/* City / Venue in blue link style */}
        <div style={{ fontSize: "0.8rem", color: "#2563eb", fontWeight: 600 }}>
          {event.city} • {event.location.split("(")[0].trim()}
        </div>
      </div>
    </Link>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Tag } from "lucide-react";
import { getAvailableCities, getAvailableCategories } from "@/lib/services/event-service";

interface EventSearchRibbonProps {
  initialSearch?: string;
  initialCity?: string;
  initialCategory?: string;
  onFilterChange?: (filters: { search: string; city: string; category: string }) => void;
}

export default function EventSearchRibbon({
  initialSearch = "",
  initialCity = "",
  initialCategory = "",
  onFilterChange,
}: EventSearchRibbonProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [city, setCity] = useState(initialCity);
  const [category, setCategory] = useState(initialCategory);

  const cities = getAvailableCities();
  const categories = getAvailableCategories();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFilterChange) {
      onFilterChange({ search, city, category });
    } else {
      const params = new URLSearchParams();
      if (search.trim()) params.set("q", search.trim());
      if (city && city !== "todas") params.set("city", city);
      if (category && category !== "todas") params.set("cat", category);
      router.push(`/eventos?${params.toString()}`);
    }
  };

  return (
    <div className="search-ribbon-wrapper">
      <div className="container">
        <form onSubmit={handleSearchSubmit} className="search-ribbon-bar">
          {/* Query Input */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Buscar por evento, conferencista o lugar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input-field"
              id="search-event-input"
            />
          </div>

          {/* City Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <MapPin size={16} color="#94a3b8" style={{ marginLeft: "8px" }} />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="search-select-field"
              id="search-city-select"
            >
              <option value="">Cualquier ciudad</option>
              {cities.map((c) => (
                <option key={c} value={c.toLowerCase()}>
                  {c}
                </option>
              ))}
              <option value="online">Online / Streaming HD</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Tag size={16} color="#94a3b8" style={{ marginLeft: "8px" }} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="search-select-field"
              id="search-category-select"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary" id="btn-submit-search">
            Buscar Eventos
          </button>
        </form>
      </div>
    </div>
  );
}

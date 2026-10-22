import { ShamaEvent, EventCategory, EventFormat } from "../types/events";
import { SHAMA_EVENTS } from "../data";

export interface EventFilterOptions {
  search?: string;
  city?: string;
  category?: string;
  format?: string;
}

export function getAllEvents(): ShamaEvent[] {
  return SHAMA_EVENTS;
}

export function getFeaturedEvents(): ShamaEvent[] {
  return SHAMA_EVENTS.filter((e) => e.isFeatured);
}

export function getEventBySlug(slug: string): ShamaEvent | undefined {
  return SHAMA_EVENTS.find((e) => e.slug === slug);
}

export function getEventById(id: string): ShamaEvent | undefined {
  return SHAMA_EVENTS.find((e) => e.id === id);
}

export function filterEvents(options: EventFilterOptions): ShamaEvent[] {
  const { search = "", city = "", category = "", format = "" } = options;
  const q = search.trim().toLowerCase();

  return SHAMA_EVENTS.filter((event) => {
    // Search match
    if (q) {
      const matchTitle = event.title.toLowerCase().includes(q);
      const matchSub = event.subtitle.toLowerCase().includes(q);
      const matchCity = event.city.toLowerCase().includes(q);
      const matchSpeaker = event.speakers.some((s) => s.name.toLowerCase().includes(q));
      if (!matchTitle && !matchSub && !matchCity && !matchSpeaker) return false;
    }

    // City match
    if (city && city !== "todas" && city !== "cualquiera") {
      if (!event.city.toLowerCase().includes(city.toLowerCase())) return false;
    }

    // Category match
    if (category && category !== "todas" && category !== "cualquiera") {
      if (event.category.toLowerCase() !== category.toLowerCase()) return false;
    }

    // Format match
    if (format && format !== "todos" && format !== "cualquiera") {
      if (event.format.toLowerCase() !== format.toLowerCase()) return false;
    }

    return true;
  });
}

export function getAvailableCities(): string[] {
  const cities = new Set<string>();
  SHAMA_EVENTS.forEach((e) => {
    cities.add(e.city.split(",")[0].trim());
  });
  return Array.from(cities);
}

export function getAvailableCategories(): Array<{ id: string; label: string }> {
  return [
    { id: "todas", label: "Todas las categorías" },
    { id: "conferencia", label: "Conferencias" },
    { id: "concierto", label: "Conciertos" },
    { id: "masterclass", label: "Masterclasses" },
    { id: "taller", label: "Talleres & Workshops" },
    { id: "seminario", label: "Seminarios" },
    { id: "teatro", label: "Teatro & Artes" },
  ];
}

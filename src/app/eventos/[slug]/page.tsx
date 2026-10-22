import React from "react";
import { notFound } from "next/navigation";
import { SHAMA_EVENTS } from "@/lib/data";
import EventDetailClient from "@/components/EventDetailClient";

export function generateStaticParams() {
  return SHAMA_EVENTS.map((e) => ({
    slug: e.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = SHAMA_EVENTS.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  return <EventDetailClient event={event} />;
}

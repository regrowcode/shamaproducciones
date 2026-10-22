import { NextResponse } from "next/server";
import { DEFAULT_BCV_RATE } from "@/lib/bcv";

export async function GET() {
  return NextResponse.json({
    rate: DEFAULT_BCV_RATE,
    currency: "VES",
    base: "USD",
    source: "Banco Central de Venezuela (BCV)",
    lastUpdated: new Date().toISOString(),
  });
}

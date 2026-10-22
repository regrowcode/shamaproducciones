/**
 * Utility for BCV exchange rate management and conversions.
 * Default fallback is established dynamically, configurable via environment or admin.
 */

export const DEFAULT_BCV_RATE = 52.45;

export interface CurrencyConfig {
  rate: number;
  lastUpdated: string;
  source: string;
}

export function usdToBs(amountUsd: number, rate: number = DEFAULT_BCV_RATE): number {
  if (amountUsd < 0 || rate <= 0) return 0;
  return Number((amountUsd * rate).toFixed(2));
}

export function bsToUsd(amountBs: number, rate: number = DEFAULT_BCV_RATE): number {
  if (amountBs < 0 || rate <= 0) return 0;
  return Number((amountBs / rate).toFixed(2));
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatBs(amount: number): string {
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "VES",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace("VES", "Bs.");
}

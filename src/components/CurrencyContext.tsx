"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DEFAULT_BCV_RATE, formatBs, formatUsd, usdToBs } from "@/lib/bcv";

interface CurrencyContextType {
  currency: "USD" | "VES";
  setCurrency: (c: "USD" | "VES") => void;
  toggleCurrency: () => void;
  rate: number;
  formatPrice: (amountUsd: number) => { main: string; secondary: string };
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<"USD" | "VES">("USD");
  const [rate] = useState<number>(DEFAULT_BCV_RATE);

  useEffect(() => {
    const saved = localStorage.getItem("shama_currency_pref");
    if (saved === "VES" || saved === "USD") {
      setCurrency(saved);
    }
  }, []);

  const handleSetCurrency = (c: "USD" | "VES") => {
    setCurrency(c);
    if (typeof window !== "undefined") {
      localStorage.setItem("shama_currency_pref", c);
    }
  };

  const toggleCurrency = () => {
    const next = currency === "USD" ? "VES" : "USD";
    handleSetCurrency(next);
  };

  const formatPrice = (amountUsd: number) => {
    const amountBs = usdToBs(amountUsd, rate);
    if (currency === "USD") {
      return {
        main: formatUsd(amountUsd),
        secondary: `(${formatBs(amountBs)})`,
      };
    } else {
      return {
        main: formatBs(amountBs),
        secondary: `(${formatUsd(amountUsd)})`,
      };
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        toggleCurrency,
        rate,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

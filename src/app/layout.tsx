import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CurrencyProvider } from "@/components/CurrencyContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Shama Producciones | Eventos, Tiquetera Online y Pagos en Venezuela",
  description:
    "Plataforma oficial de Shama Producciones. Conferencias, talleres y seminarios presenciales y online con boletos digitales cifrados, Pago Móvil y Cripto.",
  keywords: [
    "Shama Producciones",
    "Eventos Venezuela",
    "Tiquetera Online",
    "Conferencias Caracas",
    "Pago Móvil",
    "Boletos Digitales",
    "Binance Pay Venezuela",
  ],
  authors: [{ name: "Shama Producciones" }],
};

import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <CurrencyProvider>
          <Suspense fallback={<header className="navbar" style={{ height: "76px" }} />}>
            <Navbar />
          </Suspense>
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}

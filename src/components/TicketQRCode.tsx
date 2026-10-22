"use client";

import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface TicketQRCodeProps {
  payload: string;
  size?: number;
}

export default function TicketQRCode({ payload, size = 160 }: TicketQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && payload) {
      QRCode.toCanvas(canvasRef.current, payload, {
        width: size,
        margin: 1,
        color: {
          dark: "#080a10",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      }).catch((err) => {
        console.error("Error generating QR code:", err);
      });
    }
  }, [payload, size]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <canvas ref={canvasRef} style={{ borderRadius: "6px" }} />
      <span style={{ fontSize: "0.68rem", color: "#475569", marginTop: "6px", fontFamily: "monospace", letterSpacing: "0.05em" }}>
        CÓDIGO DIGITAL ÚNICO
      </span>
    </div>
  );
}

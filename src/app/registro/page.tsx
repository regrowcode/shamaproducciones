"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ticket, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

export default function RegistroPage() {
  const router = useRouter();
  const { register, user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [idCard, setIdCard] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    router.push("/mis-boletos");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim() || !idCard.trim() || !phone.trim() || !email.trim()) {
      setErrorMsg("Por favor completa todos los campos del formulario.");
      return;
    }

    setIsLoading(true);
    const result = register({
      fullName,
      idCard,
      phone,
      email,
    });
    setIsLoading(false);

    if (result.success) {
      router.push("/mis-boletos");
    } else {
      setErrorMsg(result.error || "Error al crear la cuenta.");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-clean-card">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "var(--primary-blue-light)",
              color: "var(--primary-blue)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <Ticket size={24} />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Crear Cuenta de Asistente
          </h1>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Guarda tus datos para compras en 1 clic y consulta de boletos digitales.
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: "var(--status-error-bg)",
              border: "1px solid var(--status-error)",
              color: "var(--status-error)",
              padding: "10px 14px",
              borderRadius: "6px",
              fontSize: "0.85rem",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre y Apellido *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Gabriela Mendoza"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              id="register-name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cédula de Identidad *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: V-22104928"
              required
              value={idCard}
              onChange={(e) => setIdCard(e.target.value)}
              id="register-idcard"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono / WhatsApp *</label>
            <input
              type="tel"
              className="form-input"
              placeholder="Ej: 0414-1234567"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              id="register-phone"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Correo Electrónico *</label>
            <input
              type="email"
              className="form-input"
              placeholder="nombre@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="register-email"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px", fontSize: "0.95rem" }}
            id="btn-register-submit"
          >
            {isLoading ? "Creando Cuenta..." : "Registrarme"} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" style={{ color: "var(--primary-blue)", fontWeight: 700 }}>
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ticket, ArrowRight, UserCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to mis-boletos
  if (user) {
    router.push("/mis-boletos");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Por favor ingresa tu correo electrónico.");
      return;
    }

    setIsLoading(true);
    const result = login(email);
    setIsLoading(false);

    if (result.success) {
      router.push("/mis-boletos");
    } else {
      setErrorMsg(result.error || "Error al iniciar sesión.");
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    const result = login(demoEmail);
    if (result.success) {
      router.push("/mis-boletos");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-clean-card">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
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
            Acceso a tu Cuenta
          </h1>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Ingresa para consultar tus boletos adquiridos y descargarlos.
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
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-input"
              placeholder="nombre@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="login-email-input"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px", fontSize: "0.95rem" }}
            id="btn-login-submit"
          >
            {isLoading ? "Iniciando..." : "Entrar a mi Cuenta"} <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo quick access */}
        <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-subtle)", textAlign: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
            Prueba rápida de comprador:
          </span>
          <button
            type="button"
            onClick={() => handleQuickDemo("carlos.silva@gmail.com")}
            className="btn btn-secondary btn-sm"
            style={{ width: "100%", fontSize: "0.82rem" }}
          >
            <UserCheck size={14} color="var(--primary-blue)" /> Ingresar como Carlos Silva (Comprador Demo)
          </button>
        </div>

        {/* Register link */}
        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          ¿Aún no tienes cuenta?{" "}
          <Link href="/registro" style={{ color: "var(--primary-blue)", fontWeight: 700 }}>
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

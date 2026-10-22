"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, ArrowRight, AlertCircle, KeyRound, QrCode } from "lucide-react";
import { loginAdmin, getCurrentAdmin } from "@/lib/services/auth-service";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in as admin, redirect to dashboard
  React.useEffect(() => {
    const admin = getCurrentAdmin();
    if (admin) {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Por favor completa tus credenciales administrativas.");
      return;
    }

    setIsLoading(true);
    const result = loginAdmin(email, password);
    setIsLoading(false);

    if (result.success) {
      router.push("/admin");
    } else {
      setErrorMsg(result.error || "Acceso denegado.");
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("admin");
    const result = loginAdmin(demoEmail, "admin");
    if (result.success) {
      router.push("/admin");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "40px 36px",
          width: "100%",
          maxWidth: "460px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "#0f172a",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
              boxShadow: "0 4px 14px rgba(15, 23, 42, 0.3)",
            }}
          >
            <Lock size={26} color="#f59e0b" />
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748b" }}>
            Portal Administrativo Restringido
          </span>
          <h1 style={{ fontSize: "1.7rem", fontWeight: 900, color: "#0f172a", marginTop: "4px" }}>
            Shama Backoffice
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>
            Acceso exclusivo para organizadores y personal de validación en puerta.
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
            <label className="form-label">Correo Corporativo</label>
            <input
              type="email"
              className="form-input"
              placeholder="admin@shamaproducciones.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="admin-email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña de Acceso</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="admin-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: "100%", background: "#0f172a", padding: "12px", fontSize: "0.95rem" }}
            id="btn-admin-login-submit"
          >
            {isLoading ? "Verificando..." : "Ingresar al Panel"} <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Fast Access Buttons */}
        <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "0.76rem", color: "#64748b", textAlign: "center", fontWeight: 600 }}>
            Acceso Rápido de Demostración:
          </span>
          <button
            type="button"
            onClick={() => handleQuickDemo("admin@shamaproducciones.com")}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: "0.8rem", justifyContent: "flex-start" }}
          >
            <KeyRound size={14} color="#d97706" /> Ingresar como Organizador General (Admin)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("staff@shamaproducciones.com")}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: "0.8rem", justifyContent: "flex-start" }}
          >
            <QrCode size={14} color="#2563eb" /> Ingresar como Personal de Puerta (Scanner)
          </button>
        </div>
      </div>
    </div>
  );
}

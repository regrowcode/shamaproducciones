"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    tipo: "soporte",
    mensaje: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Breadcrumb / Title */}
        <div className="mb-8">
          <nav className="text-xs text-slate-500 mb-2 flex items-center gap-2">
            <Link href="/" className="hover:text-blue-600">Inicio</Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Contáctenos</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Centro de Contacto & Atención al Cliente
          </h1>
          <p className="text-slate-600 mt-2 text-sm md:text-base">
            Estamos en Barquisimeto, Venezuela para ayudarte con la compra de tus entradas, soporte de eventos o alianzas comerciales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda: Información de Contacto */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Información de la Sede
              </h2>
              
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">Ubicación</span>
                    <span className="text-slate-600">Barquisimeto, Estado Lara, Venezuela.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">WhatsApp / Teléfono</span>
                    <a
                      href="https://wa.me/584120000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline font-medium"
                    >
                      +58 (412) 000-0000
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">Correo Electrónico</span>
                    <a
                      href="mailto:contacto@shamaproducciones.com"
                      className="text-indigo-600 hover:underline"
                    >
                      contacto@shamaproducciones.com
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">Horario de Atención</span>
                    <span className="text-slate-600">Lunes a Sábado: 8:30 AM - 6:00 PM</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Banner para Productores */}
            <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-2xl p-6 text-white shadow-md">
              <span className="inline-block px-2.5 py-0.5 bg-yellow-400 text-slate-900 text-xs font-black rounded uppercase tracking-wider mb-3">
                ¿Eres Productor u Organizador?
              </span>
              <h3 className="text-xl font-bold mb-2">Vende tu evento con Shama</h3>
              <p className="text-blue-100 text-xs leading-relaxed mb-4">
                Publica tus conferencias, conciertos, cursos o talleres y cobra por Pago Móvil, transferencia bancaria y criptomonedas.
              </p>
              <Link
                href="/venda-su-evento"
                className="inline-block w-full text-center bg-white hover:bg-slate-100 text-blue-900 font-bold py-2.5 px-4 rounded-xl text-sm transition"
              >
                Conocer plataforma para productores
              </Link>
            </div>
          </div>

          {/* Columna Derecha: Formulario de PQRS y Contacto */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    ¡Mensaje recibido con éxito!
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                    Gracias por comunicarte con Shama Producciones. Nuestro equipo de soporte en Barquisimeto te responderá a la brevedad posible.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ nombre: "", correo: "", telefono: "", tipo: "soporte", mensaje: "" });
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">
                      Envíanos un mensaje o solicitud (PQRS)
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Completa el siguiente formulario para consultas sobre tus boletos, eventos o requerimientos especiales.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nombre y Apellido *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ej: Carlos Mendoza"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.correo}
                        onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                        placeholder="tu@correo.com"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Teléfono / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        placeholder="Ej: 0412-1234567"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tipo de Solicitud *
                      </label>
                      <select
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-700"
                      >
                        <option value="soporte">Soporte con mi Boleto / Compra</option>
                        <option value="informacion">Información de un Evento</option>
                        <option value="pqrs">Petición, Queja o Reclamo (PQRS)</option>
                        <option value="organizadores">Alianza / Producción de Eventos</option>
                        <option value="otro">Otro Asunto</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mensaje o Descripción de la Solicitud *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      placeholder="Indícanos los detalles de tu consulta (si es sobre una compra, incluye el número de referencia o cédula)..."
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3 rounded-xl text-sm transition shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      Enviar Mensaje
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

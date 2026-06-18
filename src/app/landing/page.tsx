"use client";

import {
  GraduationCap, Shield, Bell, ClipboardCheck, QrCode,
  BarChart3, MessageCircle, Star, Check, ArrowRight, Phone,
} from "lucide-react";
import Link from "next/link";

const FEATURES = [
  { icon: ClipboardCheck, title: "Asistencia Digital", description: "Control diario con botones táctiles para tablet. Alertas automáticas por inasistencia." },
  { icon: QrCode, title: "Retiro Seguro QR", description: "Verificación de identidad con código QR y captura fotográfica. Bitácora inmutable." },
  { icon: Shield, title: "Seguridad Total", description: "Registro de ingreso/egreso de personal, apoderados y visitas con evidencia fotográfica." },
  { icon: Bell, title: "Notificaciones Push", description: "Plantillas inteligentes categorizadas. El apoderado recibe alertas en tiempo real vía FCM." },
  { icon: MessageCircle, title: "Chat Institucional", description: "Mensajería en tiempo real educadora-apoderado. Sin números telefónicos expuestos." },
  { icon: BarChart3, title: "Reportes y Estadísticas", description: "Gráficos de matrícula, asistencia y cumplimiento. Exportación PDF/Excel." },
];

const PLANS = [
  {
    name: "Básico", price: "1 UF", period: "/mes", color: "border-gray-300",
    features: ["Asistencia digital", "Gestión de cursos y alumnos", "Ficha de salud", "Calendario de eventos", "Hasta 30 alumnos"],
    cta: "Comenzar Gratis",
  },
  {
    name: "Profesional", price: "2.5 UF", period: "/mes", color: "border-primary-500", popular: true,
    features: ["Todo lo Básico +", "Retiro seguro QR", "Notificaciones Push", "Chat institucional", "Nutrición y menús", "RRHH y control horario", "Reportes avanzados", "Hasta 100 alumnos"],
    cta: "Elegir Plan",
  },
  {
    name: "Enterprise", price: "4.5 UF", period: "/mes", color: "border-violet-500",
    features: ["Todo lo Profesional +", "Decreto 170 / PIE", "FUEI digital", "Sesiones de especialistas", "Finanzas y recibos", "Soporte prioritario", "Alumnos ilimitados"],
    cta: "Contactar Ventas",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">USAMI EDU</span>
              <span className="ml-1 text-xs text-primary-600 font-medium">Parvularia</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#planes" className="text-sm font-medium text-gray-600 hover:text-gray-900">Planes</a>
            <a href="#contacto" className="text-sm font-medium text-gray-600 hover:text-gray-900">Contacto</a>
            <Link href="/login" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
              Ingresar
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-primary-200 mb-6">
            <Star className="h-4 w-4 text-yellow-400" />
            Sistema SaaS para Educación Parvularia en Chile
          </div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl leading-tight">
            Gestione su Jardín Infantil<br />
            <span className="text-primary-300">con seguridad y eficiencia</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-200">
            Asistencia digital, retiro seguro con QR, notificaciones push a apoderados,
            y cumplimiento Decreto 170 — todo en una sola plataforma.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="#planes" className="flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary-700 hover:bg-primary-50 transition-colors">
              Ver Planes <ArrowRight className="h-4 w-4" />
            </a>
            <a href="https://wa.me/56912345678" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
              <Phone className="h-4 w-4" /> Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="py-20" id="beneficios">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Todo lo que necesita su establecimiento</h2>
            <p className="mt-3 text-gray-500">Módulos diseñados para la realidad de los jardines infantiles y escuelas de lenguaje chilenas.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-200 p-6 hover:border-primary-300 hover:shadow-lg transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20" id="planes">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Planes adaptados a su realidad</h2>
            <p className="mt-3 text-gray-500">Sin compromiso. Escale cuando su establecimiento crezca.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl border-2 bg-white p-8 ${plan.color} ${plan.popular ? "shadow-xl scale-105" : ""}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-xs font-bold text-white">
                    Más popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`mt-8 w-full rounded-xl py-3 text-sm font-bold transition-colors ${
                  plan.popular
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" id="contacto">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">¿Tiene preguntas?</h2>
          <p className="mt-3 text-gray-500">Contáctenos y le mostraremos cómo USAMI EDU puede transformar la gestión de su establecimiento.</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a href="https://wa.me/56912345678" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-emerald-700">
              <Phone className="h-4 w-4" /> WhatsApp
            </a>
            <a href="mailto:contacto@usami.cl"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-8 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
              contacto@usami.cl
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-bold text-gray-700">USAMI EDU Parvularia</span>
          </div>
          <p className="text-xs text-gray-400">Sistema SaaS Multi-Tenant para Educación Parvularia · Chile 2026</p>
        </div>
      </footer>
    </div>
  );
}

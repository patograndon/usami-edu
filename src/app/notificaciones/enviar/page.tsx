"use client";

import { useState, useMemo } from "react";
import {
  Send, Heart, Truck, GraduationCap, MessageSquare,
  ChevronRight, Edit3, Check, Clock, Eye,
} from "lucide-react";
import { alumnos, cursos, notificationTemplates, smartNotifications, usuarios } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import {
  NOTIFICATION_CATEGORY_LABELS, NOTIFICATION_CATEGORY_COLORS,
  renderTemplate, getCursoDisplayName,
} from "@/types";
import type {
  NotificationCategory, NotificationTemplate, SmartNotification, NotificationStatus,
} from "@/types";

const CATEGORY_ICONS: Record<NotificationCategory, typeof Heart> = {
  salud: Heart,
  logistica: Truck,
  pedagogico: GraduationCap,
  solicitudes: MessageSquare,
};

const STATUS_DISPLAY: Record<NotificationStatus, { label: string; color: string }> = {
  sent: { label: "Enviada", color: "bg-gray-100 text-gray-600" },
  delivered: { label: "Entregada", color: "bg-blue-100 text-blue-700" },
  read: { label: "Leída", color: "bg-emerald-100 text-emerald-700" },
  failed: { label: "Error", color: "bg-red-100 text-red-700" },
};

type Step = "category" | "template" | "compose" | "preview" | "sent";

export default function EnviarNotificacionPage() {
  const { currentUser } = useAuth();
  const { tenant } = useTenant();

  const [step, setStep] = useState<Step>("category");
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [templateVars, setTemplateVars] = useState<Record<string, string>>({});
  const [editedBody, setEditedBody] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [localSent, setLocalSent] = useState<SmartNotification[]>(smartNotifications);

  const myAlumnos = useMemo(() => {
    if (currentUser.cursoAsignado) {
      return alumnos.filter((a) => a.cursoId === currentUser.cursoAsignado && a.activo);
    }
    return alumnos.filter((a) => a.activo);
  }, [currentUser.cursoAsignado]);

  const selectedAlumno = alumnos.find((a) => a.id === selectedStudentId);

  const categoryTemplates = useMemo(
    () => selectedCategory ? notificationTemplates.filter((t) => t.category === selectedCategory) : [],
    [selectedCategory]
  );

  function handleSelectCategory(cat: NotificationCategory) {
    setSelectedCategory(cat);
    setStep("template");
  }

  function handleSelectTemplate(tpl: NotificationTemplate) {
    setSelectedTemplate(tpl);
    const vars: Record<string, string> = {};
    for (const v of tpl.variables) {
      if (v === "child_name" && selectedAlumno) {
        vars[v] = `${selectedAlumno.nombres} ${selectedAlumno.apellidoPaterno}`;
      } else if (v === "date") {
        vars[v] = "17/06/2026";
      } else if (v === "time") {
        vars[v] = new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
      } else {
        vars[v] = "";
      }
    }
    setTemplateVars(vars);
    setStep("compose");
  }

  function getRenderedBody(): string {
    if (!selectedTemplate) return "";
    return renderTemplate(selectedTemplate.messageBody, templateVars);
  }

  function handlePreview() {
    setEditedBody(getRenderedBody());
    setStep("preview");
  }

  function handleSend() {
    if (!selectedTemplate || !selectedCategory) return;
    const notif: SmartNotification = {
      id: `sn-${Date.now()}`,
      tenantId: tenant.id,
      templateId: selectedTemplate.id,
      category: selectedCategory,
      priority: selectedCategory === "salud" ? "high" : "normal",
      title: renderTemplate(selectedTemplate.title, templateVars),
      body: isEditing ? editedBody : getRenderedBody(),
      recipientStudentId: selectedStudentId || null,
      recipientStudentName: selectedAlumno ? `${selectedAlumno.nombres} ${selectedAlumno.apellidoPaterno}` : null,
      sentBy: currentUser.id,
      sentByRole: currentUser.role,
      sentAt: new Date().toISOString(),
      status: "sent",
    };
    setLocalSent([notif, ...localSent]);
    setStep("sent");
  }

  function handleReset() {
    setStep("category");
    setSelectedCategory(null);
    setSelectedTemplate(null);
    setSelectedStudentId("");
    setTemplateVars({});
    setEditedBody("");
    setIsEditing(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enviar Notificación</h1>
          <p className="text-sm text-gray-500">Sistema de plantillas inteligentes · Trato formal</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Alumno destinatario</label>
        <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
          <option value="">Seleccionar alumno...</option>
          {myAlumnos.map((a) => (
            <option key={a.id} value={a.id}>{a.nombres} {a.apellidoPaterno} {a.apellidoMaterno}</option>
          ))}
        </select>
        {currentUser.cursoAsignado && (
          <p className="mt-1 text-xs text-gray-500">
            Mostrando solo alumnos de su curso asignado
          </p>
        )}
      </div>

      {step === "category" && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">1. Seleccione la categoría</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(Object.entries(NOTIFICATION_CATEGORY_LABELS) as [NotificationCategory, string][]).map(([key, label]) => {
              const Icon = CATEGORY_ICONS[key];
              const colors = NOTIFICATION_CATEGORY_COLORS[key];
              return (
                <button key={key} onClick={() => handleSelectCategory(key)}
                  className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all active:scale-[0.97] hover:shadow-md border-gray-200 bg-white`}>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${colors.icon}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 text-center">{label}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === "template" && selectedCategory && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setStep("category")} className="text-sm text-primary-600 hover:text-primary-700">Categorías</button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${NOTIFICATION_CATEGORY_COLORS[selectedCategory].bg} ${NOTIFICATION_CATEGORY_COLORS[selectedCategory].text}`}>
              {NOTIFICATION_CATEGORY_LABELS[selectedCategory]}
            </span>
          </div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">2. Seleccione la plantilla</h2>
          <div className="space-y-3">
            {categoryTemplates.map((tpl) => (
              <button key={tpl.id} onClick={() => handleSelectTemplate(tpl)}
                className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-primary-300 hover:shadow-sm transition-all active:scale-[0.99]">
                <p className="font-semibold text-gray-900">{tpl.title.replace(/\{\{.*?\}\}/g, "...")}</p>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{tpl.messageBody.replace(/\{\{.*?\}\}/g, "___")}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tpl.variables.map((v) => (
                    <span key={v} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 font-mono">{`{{${v}}}`}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "compose" && selectedTemplate && selectedCategory && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setStep("category")} className="text-sm text-primary-600">Categorías</button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <button onClick={() => setStep("template")} className="text-sm text-primary-600">{NOTIFICATION_CATEGORY_LABELS[selectedCategory]}</button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">Completar datos</span>
          </div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">3. Complete los datos</h2>

          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {selectedTemplate.variables.filter((v) => v !== "child_name").map((v) => (
                <div key={v}>
                  <label className="mb-1 block text-sm font-medium text-gray-700 capitalize">{v.replace(/_/g, " ")}</label>
                  <input type="text" value={templateVars[v] || ""} onChange={(e) => setTemplateVars({ ...templateVars, [v]: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Vista previa del mensaje:</p>
              <p className="text-sm text-gray-800 leading-relaxed">{getRenderedBody()}</p>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setStep("template")} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">Atrás</button>
              <button onClick={handlePreview} disabled={selectedTemplate.variables.some((v) => v !== "child_name" && !templateVars[v])}
                className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50">
                Vista Final
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "preview" && selectedTemplate && selectedCategory && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">4. Confirmar y enviar</h2>
          <div className={`rounded-xl border-2 p-6 ${NOTIFICATION_CATEGORY_COLORS[selectedCategory].bg} border-gray-200`}>
            <div className="flex items-center gap-3 mb-4">
              {(() => { const Icon = CATEGORY_ICONS[selectedCategory]; return <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${NOTIFICATION_CATEGORY_COLORS[selectedCategory].icon}`}><Icon className="h-5 w-5" /></div>; })()}
              <div>
                <p className={`text-xs font-semibold ${NOTIFICATION_CATEGORY_COLORS[selectedCategory].text}`}>{NOTIFICATION_CATEGORY_LABELS[selectedCategory]}</p>
                <p className="font-bold text-gray-900">{renderTemplate(selectedTemplate.title, templateVars)}</p>
              </div>
            </div>

            {!isEditing ? (
              <div className="rounded-lg bg-white border border-gray-200 p-4 mb-4">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{editedBody}</p>
              </div>
            ) : (
              <textarea value={editedBody} onChange={(e) => setEditedBody(e.target.value)} rows={5}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-relaxed resize-none mb-4 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            )}

            <div className="flex items-center justify-between">
              <button onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                <Edit3 className="h-4 w-4" />
                {isEditing ? "Guardar edición" : "Editar mensaje"}
              </button>
              <div className="flex gap-3">
                <button onClick={() => setStep("compose")} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700">Atrás</button>
                <button onClick={handleSend}
                  className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 active:scale-[0.98]">
                  <Send className="h-4 w-4" /> Enviar Notificación
                </button>
              </div>
            </div>

            {selectedAlumno && (
              <p className="mt-3 text-xs text-gray-500">
                Destinatario: apoderado de <strong>{selectedAlumno.nombres} {selectedAlumno.apellidoPaterno}</strong> ·
                Enviado por: {currentUser.nombreCompleto} ({currentUser.role})
              </p>
            )}
          </div>
        </div>
      )}

      {step === "sent" && (
        <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-10 text-center">
          <Check className="mx-auto h-16 w-16 text-emerald-600" />
          <h2 className="mt-4 text-xl font-bold text-emerald-800">Notificación Enviada</h2>
          <p className="mt-2 text-sm text-emerald-700">El apoderado recibirá la notificación push en su dispositivo.</p>
          <p className="mt-1 text-xs text-emerald-600">Registro guardado en la bitácora de comunicaciones del Director.</p>
          <button onClick={handleReset}
            className="mt-6 rounded-lg bg-primary-600 px-8 py-3 text-sm font-semibold text-white hover:bg-primary-700">
            Enviar otra notificación
          </button>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Bitácora de Comunicaciones</h2>
          <p className="text-xs text-gray-500">Registro auditable de todas las notificaciones enviadas</p>
        </div>
        <div className="divide-y divide-gray-100">
          {localSent.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-500">Sin notificaciones enviadas</p>
          ) : (
            localSent.map((notif) => {
              const colors = NOTIFICATION_CATEGORY_COLORS[notif.category];
              const Icon = CATEGORY_ICONS[notif.category];
              const sender = usuarios.find((u) => u.id === notif.sentBy);
              const st = STATUS_DISPLAY[notif.status];
              return (
                <div key={notif.id} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colors.icon}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{notif.body}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      <span>{sender?.nombreCompleto.split(" ").slice(0, 2).join(" ")} ({notif.sentByRole})</span>
                      <span>{notif.sentAt.replace("T", " ").substring(0, 16)}</span>
                      {notif.recipientStudentName && <span>→ {notif.recipientStudentName}</span>}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${st.color}`}>{st.label}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

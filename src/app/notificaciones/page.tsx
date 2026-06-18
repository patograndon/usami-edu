"use client";

import { useState, useMemo } from "react";
import {
  Bell, BellRing, Send, Check, CheckCheck, X, AlertTriangle,
  Smartphone, Monitor, Shield, Clock, Eye, Settings,
  UserCheck, Mail, ClipboardList, Siren, TrendingDown, FileText, CalendarDays,
} from "lucide-react";
import { notifications, deviceTokens } from "@/data/mock";
import { useStudents } from "@/hooks/useStudents";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import {
  NOTIFICATION_EVENT_LABELS, NOTIFICATION_PRIORITY_CONFIG,
  EVENT_PRIORITY_MAP, ROLE_LABELS,
} from "@/types";
import type {
  Notification as NotifType, NotificationEvent, NotificationPriority, NotificationStatus,
} from "@/types";

const EVENT_ICONS: Record<NotificationEvent, typeof Bell> = {
  checkout_student: UserCheck,
  new_circular: Mail,
  new_survey: ClipboardList,
  emergency_alert: Siren,
  attendance_alert: TrendingDown,
  d170_reevaluation: FileText,
  event_reminder: CalendarDays,
};

const STATUS_DISPLAY: Record<NotificationStatus, { label: string; icon: typeof Check; color: string }> = {
  sent: { label: "Enviada", icon: Check, color: "text-gray-400" },
  delivered: { label: "Entregada", icon: CheckCheck, color: "text-blue-500" },
  read: { label: "Leída", icon: Eye, color: "text-emerald-500" },
  failed: { label: "Error", icon: X, color: "text-red-500" },
};

export default function NotificacionesPage() {
  const { currentUser, hasPermission } = useAuth();
  const { tenant } = useTenant();
  const { data: alumnos } = useStudents();
  const { data: usuarios } = useUsers();
  const canSend = hasPermission("notificaciones.enviar");

  const [localNotifs, setLocalNotifs] = useState<NotifType[]>(notifications);
  const [filterEvent, setFilterEvent] = useState<NotificationEvent | "">("");
  const [filterPriority, setFilterPriority] = useState<NotificationPriority | "">("");
  const [showSendForm, setShowSendForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"feed" | "config" | "tokens">("feed");

  const [sendEvent, setSendEvent] = useState<NotificationEvent>("new_circular");
  const [sendTitle, setSendTitle] = useState("");
  const [sendBody, setSendBody] = useState("");
  const [sendTarget, setSendTarget] = useState("all");

  const filtered = useMemo(
    () => localNotifs
      .filter((n) => !filterEvent || n.event === filterEvent)
      .filter((n) => !filterPriority || n.priority === filterPriority)
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt)),
    [localNotifs, filterEvent, filterPriority]
  );

  const stats = useMemo(() => ({
    total: localNotifs.length,
    high: localNotifs.filter((n) => n.priority === "high").length,
    sent: localNotifs.filter((n) => n.status === "sent").length,
    delivered: localNotifs.filter((n) => n.status === "delivered").length,
    read: localNotifs.filter((n) => n.status === "read").length,
  }), [localNotifs]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const notif: NotifType = {
      id: `notif-${Date.now()}`,
      tenantId: tenant.id,
      event: sendEvent,
      priority: EVENT_PRIORITY_MAP[sendEvent],
      title: sendTitle,
      body: sendBody,
      recipientUserId: sendTarget === "all" ? null : sendTarget,
      recipientRole: sendTarget === "all" ? null : "parent",
      relatedEntityId: null,
      status: "sent",
      sentAt: new Date().toISOString(),
      readAt: null,
    };
    setLocalNotifs([notif, ...localNotifs]);
    setShowSendForm(false);
    setSendTitle(""); setSendBody("");
  }

  const eventTriggers: { event: NotificationEvent; description: string; priority: NotificationPriority }[] = [
    { event: "checkout_student", description: "Se dispara al confirmar retiro de un alumno", priority: "high" },
    { event: "emergency_alert", description: "Botón de pánico o accidente registrado", priority: "high" },
    { event: "attendance_alert", description: "Alumno con 3+ inasistencias consecutivas", priority: "high" },
    { event: "new_circular", description: "Director publica nueva circular", priority: "normal" },
    { event: "new_survey", description: "Nueva encuesta disponible", priority: "normal" },
    { event: "d170_reevaluation", description: "Reevaluación D170 próxima a vencer", priority: "normal" },
    { event: "event_reminder", description: "24h antes de un evento del calendario", priority: "normal" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centro de Notificaciones</h1>
          <p className="text-sm text-gray-500">Push Engine — Firebase Cloud Messaging</p>
        </div>
        {canSend && (
          <button onClick={() => setShowSendForm(!showSendForm)}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
            <Send className="h-4 w-4" /> Enviar Notificación
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
          <p className="text-2xl font-bold text-red-700">{stats.high}</p>
          <p className="text-xs text-red-600">Alta Prioridad</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
          <p className="text-2xl font-bold text-gray-600">{stats.sent}</p>
          <p className="text-xs text-gray-500">Enviadas</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{stats.delivered}</p>
          <p className="text-xs text-blue-600">Entregadas</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
          <p className="text-2xl font-bold text-emerald-700">{stats.read}</p>
          <p className="text-xs text-emerald-600">Leídas</p>
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {[
          { id: "feed" as const, label: "Feed de Notificaciones", icon: Bell },
          { id: "config" as const, label: "Eventos de Disparo", icon: Settings },
          { id: "tokens" as const, label: "Dispositivos Registrados", icon: Smartphone },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "border-primary-500 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {showSendForm && canSend && (
        <form onSubmit={handleSend} className="rounded-xl border border-primary-200 bg-primary-50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Enviar Notificación Manual</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tipo de Evento</label>
              <select value={sendEvent} onChange={(e) => setSendEvent(e.target.value as NotificationEvent)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
                {Object.entries(NOTIFICATION_EVENT_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Prioridad: <span className={`font-semibold ${EVENT_PRIORITY_MAP[sendEvent] === "high" ? "text-red-600" : "text-blue-600"}`}>
                  {NOTIFICATION_PRIORITY_CONFIG[EVENT_PRIORITY_MAP[sendEvent]].label}
                </span>
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Título *</label>
              <input type="text" value={sendTitle} onChange={(e) => setSendTitle(e.target.value)} required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Destinatarios</label>
              <select value={sendTarget} onChange={(e) => setSendTarget(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
                <option value="all">Todos los apoderados</option>
                <option value="staff">Todo el personal</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Mensaje *</label>
            <textarea value={sendBody} onChange={(e) => setSendBody(e.target.value)} required rows={2}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm resize-none focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowSendForm(false)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">Cancelar</button>
            <button type="submit"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
              <Send className="h-4 w-4" /> Enviar Push
            </button>
          </div>
        </form>
      )}

      {activeTab === "feed" && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <select value={filterEvent} onChange={(e) => setFilterEvent(e.target.value as NotificationEvent | "")}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="">Todos los eventos</option>
              {Object.entries(NOTIFICATION_EVENT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as NotificationPriority | "")}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="">Toda prioridad</option>
              <option value="high">Alta</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          <div className="space-y-2">
            {filtered.map((notif) => {
              const Icon = EVENT_ICONS[notif.event];
              const statusInfo = STATUS_DISPLAY[notif.status];
              const StatusIcon = statusInfo.icon;
              const prioConfig = NOTIFICATION_PRIORITY_CONFIG[notif.priority];
              return (
                <div key={notif.id} className={`rounded-xl border bg-white p-4 ${
                  notif.priority === "high" ? "border-l-4 border-l-red-500 border-red-200" : "border-gray-200"
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      notif.priority === "high" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{notif.title}</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${prioConfig.color}`}>{prioConfig.label}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-600">{notif.body}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                        <span>{NOTIFICATION_EVENT_LABELS[notif.event]}</span>
                        <span>{notif.sentAt.replace("T", " ").substring(0, 16)}</span>
                        <span className={`flex items-center gap-1 ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3" /> {statusInfo.label}
                        </span>
                        {notif.recipientRole && <span>→ {notif.recipientRole}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "config" && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Eventos de Disparo Automático</h2>
            <p className="text-sm text-gray-500">El sistema dispara notificaciones FCM automáticamente ante estos eventos</p>
          </div>
          <div className="divide-y divide-gray-100">
            {eventTriggers.map((trigger) => {
              const Icon = EVENT_ICONS[trigger.event];
              return (
                <div key={trigger.event} className="flex items-center gap-4 px-5 py-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    trigger.priority === "high" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{NOTIFICATION_EVENT_LABELS[trigger.event]}</p>
                    <p className="text-sm text-gray-500">{trigger.description}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${NOTIFICATION_PRIORITY_CONFIG[trigger.priority].color}`}>
                    {NOTIFICATION_PRIORITY_CONFIG[trigger.priority].label}
                  </span>
                  <div className="flex h-6 w-10 items-center rounded-full bg-emerald-500 px-0.5">
                    <div className="h-5 w-5 rounded-full bg-white shadow translate-x-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "tokens" && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Dispositivos Registrados (FCM Tokens)</h2>
            <p className="text-sm text-gray-500">{deviceTokens.filter((t) => t.active).length} dispositivos activos</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 font-semibold text-gray-600">Usuario</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Dispositivo</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Token FCM</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Última Actualización</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deviceTokens.map((token) => {
                  const user = usuarios.find((u) => u.id === token.userId);
                  return (
                    <tr key={token.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {user?.nombreCompleto || token.userId}
                      </td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          {token.deviceType === "android" ? <Smartphone className="h-3.5 w-3.5" /> :
                           token.deviceType === "ios" ? <Smartphone className="h-3.5 w-3.5" /> :
                           <Monitor className="h-3.5 w-3.5" />}
                          {token.deviceType.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-gray-500 max-w-[200px] truncate">{token.fcmToken}</td>
                      <td className="px-5 py-3 text-gray-600 text-xs">{token.lastUpdated.replace("T", " ").substring(0, 16)}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          token.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {token.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  CalendarDays,
  Globe,
  Lock,
} from "lucide-react";
import { schoolEvents, cursos } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { getCursoDisplayName } from "@/types";
import type { SchoolEvent, EventType } from "@/types";
import { EVENT_TYPE_LABELS, EVENT_TYPE_COLORS } from "@/types";

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function CalendarioPage() {
  const { currentUser, hasPermission } = useAuth();
  const { tenant } = useTenant();
  const canCreate = hasPermission("calendario.crear");

  const [localEvents, setLocalEvents] = useState<SchoolEvent[]>(schoolEvents);
  const [currentMonth, setCurrentMonth] = useState(5);
  const [currentYear, setCurrentYear] = useState(2026);
  const [filterCurso, setFilterCurso] = useState("");
  const [filterType, setFilterType] = useState<EventType | "">("");
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formType, setFormType] = useState<EventType>("actividad_escolar");
  const [formCurso, setFormCurso] = useState("");
  const [formPublic, setFormPublic] = useState(true);

  const filteredEvents = useMemo(
    () => localEvents.filter((e) => {
      if (filterCurso && e.cursoId !== filterCurso) return false;
      if (filterType && e.type !== filterType) return false;
      return true;
    }),
    [localEvents, filterCurso, filterType]
  );

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString("es-CL", { month: "long", year: "numeric" });

  function eventsForDay(day: number) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return filteredEvents.filter((e) => e.startDate <= dateStr && e.endDate >= dateStr);
  }

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  }

  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  }

  function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    const evt: SchoolEvent = {
      id: `evt-${Date.now()}`,
      tenantId: tenant.id,
      title: formTitle,
      description: formDesc,
      startDate: formStart,
      endDate: formEnd || formStart,
      type: formType,
      cursoId: formCurso || null,
      isPublic: formPublic,
      createdBy: currentUser.id,
    };
    setLocalEvents([...localEvents, evt]);
    setShowModal(false);
    setFormTitle(""); setFormDesc(""); setFormStart(""); setFormEnd("");
  }

  function handleDayClick(day: number) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDay(selectedDay === dateStr ? null : dateStr);
  }

  const selectedDayEvents = selectedDay
    ? filteredEvents.filter((e) => e.startDate <= selectedDay && e.endDate >= selectedDay)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendario Escolar</h1>
          <p className="text-sm text-gray-500">{localEvents.length} eventos programados</p>
        </div>
        {canCreate && (
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
            <Plus className="h-4 w-4" /> Nuevo Evento
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={filterCurso} onChange={(e) => setFilterCurso(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
          <option value="">Todos los cursos</option>
          {cursos.filter((c) => c.activo).map((c) => (
            <option key={c.id} value={c.id}>{getCursoDisplayName(c)}</option>
          ))}
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as EventType | "")}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
          <option value="">Todos los tipos</option>
          {(Object.entries(EVENT_TYPE_LABELS) as [EventType, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <button onClick={prevMonth} className="rounded-lg p-2 hover:bg-gray-100"><ChevronLeft className="h-5 w-5" /></button>
          <h2 className="text-lg font-bold text-gray-900 capitalize">{monthLabel}</h2>
          <button onClick={nextMonth} className="rounded-lg p-2 hover:bg-gray-100"><ChevronRight className="h-5 w-5" /></button>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-200">
          {DAYS.map((d) => (
            <div key={d} className="px-2 py-2 text-center text-xs font-semibold text-gray-500">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[80px] border-b border-r border-gray-100 bg-gray-50" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = eventsForDay(day);
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = dateStr === "2026-06-17";
            const isSelected = dateStr === selectedDay;
            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`min-h-[80px] border-b border-r border-gray-100 p-1.5 text-left transition-colors hover:bg-blue-50 ${
                  isToday ? "bg-primary-50" : ""
                } ${isSelected ? "ring-2 ring-primary-500 ring-inset" : ""}`}
              >
                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  isToday ? "bg-primary-600 text-white" : "text-gray-700"
                }`}>
                  {day}
                </span>
                <div className="mt-0.5 space-y-0.5">
                  {dayEvents.slice(0, 2).map((evt) => (
                    <div key={evt.id} className={`rounded px-1 py-0.5 text-[10px] font-medium text-white truncate ${EVENT_TYPE_COLORS[evt.type]}`}>
                      {evt.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <p className="text-[10px] text-gray-400">+{dayEvents.length - 2} más</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-base font-semibold text-gray-900">
            Eventos del {new Date(selectedDay + "T12:00:00").toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })}
          </h3>
          {selectedDayEvents.length === 0 ? (
            <p className="text-sm text-gray-500">Sin eventos este día</p>
          ) : (
            <div className="space-y-3">
              {selectedDayEvents.map((evt) => {
                const curso = evt.cursoId ? cursos.find((c) => c.id === evt.cursoId) : null;
                return (
                  <div key={evt.id} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${EVENT_TYPE_COLORS[evt.type]}`} />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{evt.title}</p>
                      <p className="text-sm text-gray-600">{evt.description}</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">{EVENT_TYPE_LABELS[evt.type]}</span>
                        {curso && <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs text-primary-700">{getCursoDisplayName(curso)}</span>}
                        {evt.isPublic ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-600"><Globe className="h-3 w-3" /> Público</span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-gray-400"><Lock className="h-3 w-3" /> Interno</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Crear Evento</h2>
              <button onClick={() => setShowModal(false)} className="rounded p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Título *</label>
                <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
                <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={2}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm resize-none focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Fecha inicio *</label>
                  <input type="date" value={formStart} onChange={(e) => setFormStart(e.target.value)} required
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Fecha fin</label>
                  <input type="date" value={formEnd} onChange={(e) => setFormEnd(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Tipo *</label>
                  <select value={formType} onChange={(e) => setFormType(e.target.value as EventType)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
                    {(Object.entries(EVENT_TYPE_LABELS) as [EventType, string][]).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Curso (opcional)</label>
                  <select value={formCurso} onChange={(e) => setFormCurso(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
                    <option value="">Todos los cursos</option>
                    {cursos.filter((c) => c.activo).map((c) => (
                      <option key={c.id} value={c.id}>{getCursoDisplayName(c)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formPublic} onChange={(e) => setFormPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-gray-700">Visible para apoderados</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit"
                  className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                  <Save className="h-4 w-4" /> Crear Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

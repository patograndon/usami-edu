"use client";

import { useState, useMemo } from "react";
import { Send, Plus, X, Save, BarChart3, Mail, ClipboardList } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { communications } from "@/data/mock";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { getCursoDisplayName, COMM_TYPE_LABELS } from "@/types";
import type { Communication, CommunicationType, TargetAudience, SurveyQuestion } from "@/types";

export default function ComunicacionesPage() {
  const { currentUser, hasPermission } = useAuth();
  const { tenant } = useTenant();
  const { data: cursos } = useCourses();
  const canCreate = hasPermission("comunicaciones.crear");

  const [localComms, setLocalComms] = useState<Communication[]>(communications);
  const [showForm, setShowForm] = useState(false);
  const [viewSurvey, setViewSurvey] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formType, setFormType] = useState<CommunicationType>("circular");
  const [formTarget, setFormTarget] = useState<TargetAudience>("todos");
  const [formCurso, setFormCurso] = useState("");
  const [formQuestions, setFormQuestions] = useState<{ pregunta: string; opciones: string }[]>([]);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const comm: Communication = {
      id: `comm-${Date.now()}`,
      tenantId: tenant.id,
      title: formTitle,
      body: formBody,
      type: formType,
      targetAudience: formTarget,
      targetCursoId: formTarget === "curso" ? formCurso : null,
      questions: formType === "encuesta"
        ? formQuestions.map((q, i) => ({
            id: `q-${i}`,
            pregunta: q.pregunta,
            opciones: q.opciones.split(",").map((o) => o.trim()),
            respuestas: {},
          }))
        : [],
      publishedAt: new Date().toISOString(),
      createdBy: currentUser.id,
      isRead: false,
    };
    setLocalComms([comm, ...localComms]);
    setShowForm(false);
    setFormTitle(""); setFormBody(""); setFormQuestions([]);
  }

  const activeSurvey = viewSurvey ? localComms.find((c) => c.id === viewSurvey && c.type === "encuesta") : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comunicaciones</h1>
          <p className="text-sm text-gray-500">{localComms.length} circulares y encuestas</p>
        </div>
        {canCreate && (
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
            <Plus className="h-4 w-4" /> Nueva Comunicación
          </button>
        )}
      </div>

      {showForm && canCreate && (
        <form onSubmit={handleCreate} className="rounded-xl border border-primary-200 bg-primary-50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Crear Comunicación</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Título *</label>
              <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Mensaje *</label>
              <textarea value={formBody} onChange={(e) => setFormBody(e.target.value)} required rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm resize-none focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tipo</label>
              <select value={formType} onChange={(e) => setFormType(e.target.value as CommunicationType)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
                <option value="circular">Circular</option>
                <option value="encuesta">Encuesta</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Destinatarios</label>
              <select value={formTarget} onChange={(e) => setFormTarget(e.target.value as TargetAudience)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
                <option value="todos">Todo el establecimiento</option>
                <option value="curso">Curso específico</option>
              </select>
            </div>
            {formTarget === "curso" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Curso</label>
                <select value={formCurso} onChange={(e) => setFormCurso(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
                  <option value="">Seleccionar...</option>
                  {cursos.filter((c) => c.activo).map((c) => (
                    <option key={c.id} value={c.id}>{getCursoDisplayName(c)}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          {formType === "encuesta" && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Preguntas</p>
              {formQuestions.map((q, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" placeholder="Pregunta" value={q.pregunta}
                    onChange={(e) => { const nq = [...formQuestions]; nq[i].pregunta = e.target.value; setFormQuestions(nq); }}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
                  <input type="text" placeholder="Opción1, Opción2, ..." value={q.opciones}
                    onChange={(e) => { const nq = [...formQuestions]; nq[i].opciones = e.target.value; setFormQuestions(nq); }}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
                  <button type="button" onClick={() => setFormQuestions(formQuestions.filter((_, j) => j !== i))}
                    className="rounded p-2 text-red-500 hover:bg-red-50"><X className="h-4 w-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => setFormQuestions([...formQuestions, { pregunta: "", opciones: "" }])}
                className="text-sm font-medium text-primary-600 hover:text-primary-700">+ Agregar pregunta</button>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button type="submit"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
              <Send className="h-4 w-4" /> Enviar
            </button>
          </div>
        </form>
      )}

      {activeSurvey && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-violet-900">Resultados: {activeSurvey.title}</h2>
            <button onClick={() => setViewSurvey(null)} className="rounded p-1 hover:bg-violet-100"><X className="h-5 w-5" /></button>
          </div>
          <div className="space-y-6">
            {activeSurvey.questions.map((q) => {
              const chartData = q.opciones.map((o) => ({ name: o, votos: q.respuestas[o] || 0 }));
              return (
                <div key={q.id} className="rounded-lg border border-violet-200 bg-white p-4">
                  <p className="mb-3 font-medium text-gray-900">{q.pregunta}</p>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                        <Bar dataKey="votos" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {localComms.map((comm) => {
          const curso = comm.targetCursoId ? cursos.find((c) => c.id === comm.targetCursoId) : null;
          return (
            <div key={comm.id} className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    comm.type === "encuesta" ? "bg-violet-100 text-violet-600" : "bg-blue-100 text-blue-600"
                  }`}>
                    {comm.type === "encuesta" ? <ClipboardList className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{comm.title}</p>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{comm.body}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        comm.type === "encuesta" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"
                      }`}>{COMM_TYPE_LABELS[comm.type]}</span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {comm.targetAudience === "todos" ? "Todo el establecimiento" : `Curso: ${curso ? getCursoDisplayName(curso) : ""}`}
                      </span>
                      <span className="text-xs text-gray-400">{comm.publishedAt.split("T")[0]}</span>
                    </div>
                  </div>
                </div>
                {comm.type === "encuesta" && comm.questions.length > 0 && (
                  <button onClick={() => setViewSurvey(comm.id)}
                    className="flex items-center gap-1 rounded-lg border border-violet-300 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100">
                    <BarChart3 className="h-3.5 w-3.5" /> Resultados
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

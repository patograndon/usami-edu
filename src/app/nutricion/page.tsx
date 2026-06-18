"use client";

import { useState } from "react";
import { UtensilsCrossed, Plus, Save, X, ChevronLeft, ChevronRight } from "lucide-react";
import { menusSemanal } from "@/data/mock";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { DIA_LABELS } from "@/types";
import type { MenuSemanal, MenuDia, DiaSemana } from "@/types";

const DIAS: DiaSemana[] = ["lunes", "martes", "miercoles", "jueves", "viernes"];
const COMIDAS = ["desayuno", "almuerzo", "once", "colacion"] as const;
const COMIDA_LABELS_MAP = { desayuno: "Desayuno", almuerzo: "Almuerzo", once: "Once", colacion: "Colación" };

export default function NutricionPage() {
  const { hasPermission } = useAuth();
  const { tenant } = useTenant();
  const { data: cursos } = useCourses();
  const canCreate = hasPermission("menus.crear");

  const [localMenus, setLocalMenus] = useState<MenuSemanal[]>(menusSemanal);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const currentMenu = localMenus[selectedIdx];

  const [formSemana, setFormSemana] = useState("");
  const [formDias, setFormDias] = useState<MenuDia[]>(
    DIAS.map((dia) => ({ dia, desayuno: "", almuerzo: "", once: "", colacion: "" }))
  );

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const start = formSemana;
    const end = new Date(new Date(formSemana).getTime() + 4 * 86400000).toISOString().split("T")[0];
    const menu: MenuSemanal = {
      id: `menu-${Date.now()}`,
      tenantId: tenant.id,
      semanaInicio: start,
      semanaFin: end,
      cursoId: null,
      dias: formDias,
      createdBy: "usr-001",
      createdAt: new Date().toISOString(),
    };
    setLocalMenus([menu, ...localMenus]);
    setShowForm(false);
    setSelectedIdx(0);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menú y Nutrición</h1>
          <p className="text-sm text-gray-500">{localMenus.length} menús semanales registrados</p>
        </div>
        {canCreate && (
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700">
            <Plus className="h-4 w-4" /> Nuevo Menú Semanal
          </button>
        )}
      </div>

      {showForm && canCreate && (
        <form onSubmit={handleCreate} className="rounded-xl border border-orange-200 bg-orange-50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Crear Menú Semanal</h2>
            <button type="button" onClick={() => setShowForm(false)}><X className="h-5 w-5 text-gray-400" /></button>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Semana del (Lunes) *</label>
            <input type="date" value={formSemana} onChange={(e) => setFormSemana(e.target.value)} required
              className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-orange-200">
                  <th className="px-3 py-2 text-left font-semibold text-gray-600 w-24">Día</th>
                  {COMIDAS.map((c) => <th key={c} className="px-3 py-2 text-left font-semibold text-gray-600">{COMIDA_LABELS_MAP[c]}</th>)}
                </tr>
              </thead>
              <tbody>
                {formDias.map((dia, i) => (
                  <tr key={dia.dia} className="border-b border-orange-100">
                    <td className="px-3 py-2 font-medium text-gray-700">{DIA_LABELS[dia.dia]}</td>
                    {COMIDAS.map((c) => (
                      <td key={c} className="px-3 py-2">
                        <input type="text" value={dia[c]} placeholder={COMIDA_LABELS_MAP[c]}
                          onChange={(e) => { const nd = [...formDias]; nd[i] = { ...nd[i], [c]: e.target.value }; setFormDias(nd); }}
                          className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">Cancelar</button>
            <button type="submit" className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">
              <Save className="h-4 w-4" /> Guardar Menú
            </button>
          </div>
        </form>
      )}

      {localMenus.length > 0 && currentMenu && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <button onClick={() => setSelectedIdx(Math.min(selectedIdx + 1, localMenus.length - 1))}
              disabled={selectedIdx >= localMenus.length - 1}
              className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-30"><ChevronLeft className="h-5 w-5" /></button>
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center">
                <UtensilsCrossed className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900">Menú Semanal</h2>
              </div>
              <p className="text-sm text-gray-500">{currentMenu.semanaInicio} — {currentMenu.semanaFin}</p>
            </div>
            <button onClick={() => setSelectedIdx(Math.max(selectedIdx - 1, 0))}
              disabled={selectedIdx <= 0}
              className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-30"><ChevronRight className="h-5 w-5" /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 text-left font-semibold text-gray-600 w-28">Día</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Desayuno</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Almuerzo</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Once</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Colación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentMenu.dias.map((dia) => (
                  <tr key={dia.dia} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-semibold text-gray-800">{DIA_LABELS[dia.dia]}</td>
                    <td className="px-5 py-3 text-gray-700">{dia.desayuno}</td>
                    <td className="px-5 py-3 text-gray-700">{dia.almuerzo}</td>
                    <td className="px-5 py-3 text-gray-700">{dia.once}</td>
                    <td className="px-5 py-3 text-gray-700">{dia.colacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

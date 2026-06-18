"use client";

import { QrCode, Download, RefreshCw } from "lucide-react";
import type { Alumno } from "@/types";

export default function SeccionSeguridadQR({ alumno }: { alumno: Alumno }) {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50">
        <div className="text-center">
          <QrCode className="mx-auto h-20 w-20 text-gray-400" />
          <p className="mt-2 text-xs text-gray-500">Código QR</p>
        </div>
      </div>

      <div className="text-center">
        <p className="font-mono text-sm font-medium text-gray-700">{alumno.codigoQR}</p>
        <p className="mt-1 text-xs text-gray-500">
          Código único de identificación para retiro seguro
        </p>
      </div>

      <div className="flex gap-3">
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Download className="h-4 w-4" />
          Descargar QR
        </button>
        <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          <RefreshCw className="h-4 w-4" />
          Regenerar
        </button>
      </div>

      <div className="max-w-sm rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
        <p className="text-sm text-blue-700">
          Este código QR debe ser presentado por la persona autorizada al momento de retirar al alumno del establecimiento.
        </p>
      </div>
    </div>
  );
}

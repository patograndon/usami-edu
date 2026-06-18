"use client";

import KpiCard from "./KpiCard";
import type { KpiData } from "@/types";

export default function KpiGrid({ data }: { data: KpiData[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {data.map((kpi) => (
        <KpiCard key={kpi.label} data={kpi} />
      ))}
    </div>
  );
}

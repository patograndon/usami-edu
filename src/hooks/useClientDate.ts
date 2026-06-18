"use client";

import { useState, useEffect } from "react";

export function useClientDate() {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    setDate(new Date());
  }, []);

  const todayStr = date ? date.toISOString().split("T")[0] : "2026-06-16";

  const todayLabel = date
    ? date.toLocaleDateString("es-CL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return { date, todayStr, todayLabel, loaded: date !== null };
}

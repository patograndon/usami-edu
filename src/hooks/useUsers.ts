"use client";

import { useCallback } from "react";
import { useApiData } from "./useApiData";
import * as api from "@/services/api";
import { mapApiUser } from "@/services/mappers";
import { usuarios as mockUsuarios } from "@/data/mock";
import type { User } from "@/types";

export function useUsers() {
  const apiFn = useCallback(async (): Promise<User[]> => {
    const raw = await api.getUsers();
    return raw.map(mapApiUser);
  }, []);

  return useApiData<User[]>({
    apiFn,
    mockData: mockUsuarios,
  });
}

export function useUserById(id: string) {
  const apiFn = useCallback(async (): Promise<User | null> => {
    const raw = await api.getUserById(id);
    return mapApiUser(raw);
  }, [id]);

  const mock = mockUsuarios.find((u) => u.id === id) || null;

  return useApiData<User | null>({
    apiFn,
    mockData: mock,
  });
}

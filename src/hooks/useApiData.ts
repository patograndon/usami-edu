"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getAuthToken } from "@/services/api";

interface UseApiDataOptions<T> {
  apiFn: () => Promise<T>;
  mockData: T;
  enabled?: boolean;
}

interface UseApiDataResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  isFromApi: boolean;
  refetch: () => Promise<void>;
  mutate: (updater: T | ((prev: T) => T)) => void;
}

export function useApiData<T>({
  apiFn,
  mockData,
  enabled = true,
}: UseApiDataOptions<T>): UseApiDataResult<T> {
  const [data, setData] = useState<T>(mockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromApi, setIsFromApi] = useState(false);
  const mountedRef = useRef(true);

  const fetch = useCallback(async () => {
    const token = getAuthToken();
    if (!token || !enabled) {
      setData(mockData);
      setIsFromApi(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await apiFn();
      if (mountedRef.current) {
        setData(result);
        setIsFromApi(true);
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err.message || "Error de conexión");
        setData(mockData);
        setIsFromApi(false);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiFn, mockData, enabled]);

  useEffect(() => {
    mountedRef.current = true;
    fetch();
    return () => {
      mountedRef.current = false;
    };
  }, [fetch]);

  const mutate = useCallback((updater: T | ((prev: T) => T)) => {
    setData((prev) =>
      typeof updater === "function" ? (updater as (prev: T) => T)(prev) : updater
    );
  }, []);

  return { data, loading, error, isFromApi, refetch: fetch, mutate };
}

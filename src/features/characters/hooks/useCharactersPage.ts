"use client";

import { useEffect, useState } from "react";
import { getCharacters } from "@/services/rick-and-morty-api";
import type { CharacterPageResponse } from "@/types/rick-and-morty";

interface UseCharactersPageResult {
  data: CharacterPageResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCharactersPage(page: number): UseCharactersPageResult {
  const [data, setData] = useState<CharacterPageResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState<number>(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getCharacters(page, controller.signal);

        if (!active) {
          return;
        }

        setData(response);
      } catch (err) {
        if (!active) {
          return;
        }

        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError("No pudimos cargar personajes. Intenta nuevamente.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
      controller.abort();
    };
  }, [page, retryTick]);

  return {
    data,
    isLoading,
    error,
    refetch: () => {
      setRetryTick((current) => current + 1);
    }
  };
}

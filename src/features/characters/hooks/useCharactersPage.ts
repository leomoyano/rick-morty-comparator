"use client";

import { useEffect, useState } from "react";
import { ApiError, getCharacters } from "@/services/rick-and-morty-api";
import type { CharacterPageResponse } from "@/types/rick-and-morty";

interface UseCharactersPageResult {
  data: CharacterPageResponse | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  refetch: () => void;
}

const DEFAULT_LOADING_MESSAGE = "Cargando personajes...";
const RATE_LIMIT_LOADING_MESSAGE = "Demasiados intentos en este momento, recargando...";
const FALLBACK_RETRY_DELAY_MS = 3000;

export function useCharactersPage(page: number): UseCharactersPageResult {
  const [data, setData] = useState<CharacterPageResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>(DEFAULT_LOADING_MESSAGE);
  const [error, setError] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState<number>(0);

  useEffect(() => {
    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let keepLoadingAfterCatch = false;

    async function load() {
      try {
        setIsLoading(true);
        setLoadingMessage(DEFAULT_LOADING_MESSAGE);
        setError(null);

        const response = await getCharacters(page);

        if (!active) {
          return;
        }

        setData(response);
      } catch (err) {
        if (!active) {
          return;
        }

        if (err instanceof ApiError && err.status === 429) {
          keepLoadingAfterCatch = true;
          setError(null);
          setLoadingMessage(RATE_LIMIT_LOADING_MESSAGE);

          const retryDelay = err.retryAfterMs ?? FALLBACK_RETRY_DELAY_MS;
          retryTimer = setTimeout(() => {
            if (!active) {
              return;
            }

            setRetryTick((current) => current + 1);
          }, retryDelay);
        } else if (err instanceof ApiError && err.status === 408) {
          setError("La API esta tardando demasiado en responder. Intenta nuevamente.");
        } else {
          setError("No pudimos cargar personajes. Intenta nuevamente.");
        }
      } finally {
        if (active && !keepLoadingAfterCatch) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
    };
  }, [page, retryTick]);

  return {
    data,
    isLoading,
    loadingMessage,
    error,
    refetch: () => {
      setRetryTick((current) => current + 1);
    }
  };
}

"use client";

import { useEffect, useState } from "react";
import { getEpisodesByIds } from "@/services/rick-and-morty-api";
import type { Character } from "@/types/rick-and-morty";
import {
  buildEpisodeBuckets,
  computeEpisodeIdBuckets,
  mapEpisodesById,
  type EpisodeBuckets
} from "@/utils/episodes";

interface UseEpisodeComparisonResult {
  buckets: EpisodeBuckets | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEpisodeComparison(
  character1: Character | null,
  character2: Character | null
): UseEpisodeComparisonResult {
  const [buckets, setBuckets] = useState<EpisodeBuckets | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState<number>(0);

  useEffect(() => {
    if (!character1 || !character2) {
      setBuckets(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const selectedCharacter1 = character1;
    const selectedCharacter2 = character2;

    const controller = new AbortController();
    let active = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        const idBuckets = computeEpisodeIdBuckets(
          selectedCharacter1.episode,
          selectedCharacter2.episode
        );
        const episodes = await getEpisodesByIds(idBuckets.allIds, controller.signal);
        const episodesById = mapEpisodesById(episodes);
        const computedBuckets = buildEpisodeBuckets(episodesById, idBuckets);

        if (!active) {
          return;
        }

        setBuckets(computedBuckets);
      } catch (err) {
        if (!active) {
          return;
        }

        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError("No pudimos cargar episodios. Intenta nuevamente.");
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
  }, [character1, character2, retryTick]);

  return {
    buckets,
    isLoading,
    error,
    refetch: () => setRetryTick((current) => current + 1)
  };
}

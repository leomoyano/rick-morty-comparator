"use client";

import type { Character } from "@/types/rick-and-morty";
import { useEpisodeComparison } from "../hooks/useEpisodeComparison";
import { EpisodeSection } from "./EpisodeSection";

interface EpisodesComparisonBoardProps {
  character1: Character;
  character2: Character;
}

export function EpisodesComparisonBoard({
  character1,
  character2
}: EpisodesComparisonBoardProps) {
  const { buckets, isLoading, error, refetch } = useEpisodeComparison(character1, character2);

  if (isLoading) {
    return (
      <section className="episodesBoard" role="status" aria-live="polite">
        <div className="stateBox">
          <p className="stateText">Loading episodes comparison...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="episodesBoard" role="alert">
        <div className="stateBox">
          <p className="stateText">{error}</p>
          <div className="stateAction">
            <button type="button" className="button" onClick={refetch}>
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!buckets) {
    return null;
  }

  return (
    <section className="episodesBoard" aria-label="Episodes comparison board">
      <div className="episodesGrid">
        <EpisodeSection
          title={`Character #1 - Only Episodes (${character1.name})`}
          episodes={buckets.onlyCharacter1}
        />
        <EpisodeSection title="Shared Episodes" episodes={buckets.shared} />
        <EpisodeSection
          title={`Character #2 - Only Episodes (${character2.name})`}
          episodes={buckets.onlyCharacter2}
        />
      </div>
    </section>
  );
}

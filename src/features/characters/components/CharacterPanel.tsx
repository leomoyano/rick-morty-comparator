"use client";

import { useState } from "react";
import type { Character } from "@/types/rick-and-morty";
import { useCharactersPage } from "../hooks/useCharactersPage";
import { CharacterList } from "./CharacterList";

interface CharacterPanelProps {
  title: string;
  selectedCharacterId: number | null;
  onSelectCharacter: (character: Character) => void;
}

export function CharacterPanel({
  title,
  selectedCharacterId,
  onSelectCharacter
}: CharacterPanelProps) {
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, error, refetch } = useCharactersPage(page);

  const totalPages = data?.info.pages ?? 1;
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <section className="panel" aria-label={title}>
      <header className="panelHeader">
        <h2 className="panelTitle">{title}</h2>
        <div className="pagination" aria-label={`${title} pagination`}>
          <button
            type="button"
            className="button"
            onClick={() => setPage((current) => current - 1)}
            disabled={!canGoPrev}
          >
            Prev
          </button>
          <span className="paginationText">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            className="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={!canGoNext}
          >
            Next
          </button>
        </div>
      </header>

      <CharacterList
        characters={data?.results ?? []}
        selectedCharacterId={selectedCharacterId}
        onSelectCharacter={onSelectCharacter}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />
    </section>
  );
}

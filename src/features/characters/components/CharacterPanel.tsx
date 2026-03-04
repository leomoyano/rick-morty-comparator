"use client";

import { useMemo, useState } from "react";
import type { Character } from "@/types/rick-and-morty";
import { filterCharactersByName } from "@/utils/characters";
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data, isLoading, loadingMessage, error, refetch } = useCharactersPage(page);

  const totalPages = data?.info.pages ?? 1;
  const canGoPrev = page > 1 && !isLoading;
  const canGoNext = page < totalPages && !isLoading;

  const filteredCharacters = useMemo(() => {
    const characters = data?.results ?? [];
    return filterCharactersByName(characters, searchTerm);
  }, [data?.results, searchTerm]);

  const emptyMessage = searchTerm.trim()
    ? `No hay resultados para "${searchTerm.trim()}" en esta pagina.`
    : "No hay personajes para mostrar en esta pagina.";

  return (
    <section className="panel" aria-label={title}>
      <header className="panelHeader">
        <div className="panelHeaderTop">
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
        </div>

        <div className="panelSearchRow">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="searchInput"
            placeholder="Search character by name"
            aria-label={`${title} search by name`}
          />
        </div>
      </header>

      <CharacterList
        characters={filteredCharacters}
        selectedCharacterId={selectedCharacterId}
        onSelectCharacter={onSelectCharacter}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        emptyMessage={emptyMessage}
        error={error}
        onRetry={refetch}
      />
    </section>
  );
}

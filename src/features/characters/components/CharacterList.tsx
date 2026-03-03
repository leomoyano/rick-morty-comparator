"use client";

import type { Character } from "@/types/rick-and-morty";
import { CharacterCard } from "./CharacterCard";

interface CharacterListProps {
  characters: Character[];
  selectedCharacterId: number | null;
  onSelectCharacter: (character: Character) => void;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function CharacterList({
  characters,
  selectedCharacterId,
  onSelectCharacter,
  isLoading,
  error,
  onRetry
}: CharacterListProps) {
  if (isLoading) {
    return (
      <div className="stateBox" role="status" aria-live="polite">
        <p className="stateText">Cargando personajes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stateBox" role="alert">
        <p className="stateText">{error}</p>
        <div className="stateAction">
          <button type="button" className="button" onClick={onRetry}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="stateBox">
        <p className="stateText">No hay personajes para mostrar en esta pagina.</p>
      </div>
    );
  }

  return (
    <div className="cardsGrid">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          selected={selectedCharacterId === character.id}
          onSelect={onSelectCharacter}
        />
      ))}
    </div>
  );
}

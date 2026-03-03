"use client";

import Image from "next/image";
import type { Character } from "@/types/rick-and-morty";

interface CharacterCardProps {
  character: Character;
  selected: boolean;
  onSelect: (character: Character) => void;
}

function toStatusClass(status: Character["status"]): string {
  const normalized = status.toLowerCase();
  if (normalized === "alive" || normalized === "dead" || normalized === "unknown") {
    return `status-${normalized}`;
  }

  return "status-unknown";
}

export function CharacterCard({ character, selected, onSelect }: CharacterCardProps) {
  return (
    <button
      type="button"
      className={`card ${selected ? "cardSelected" : ""}`}
      aria-pressed={selected}
      onClick={() => onSelect(character)}
    >
      <Image
        src={character.image}
        alt={character.name}
        width={72}
        height={72}
        className="avatar"
      />
      <div className="cardBody">
        <h3 className="cardName" title={character.name}>
          {character.name}
        </h3>
        <p className="cardMeta" title={`${character.status} - ${character.species}`}>
          <span className={`statusDot ${toStatusClass(character.status)}`} aria-hidden="true" />
          {character.status} - {character.species}
        </p>
      </div>
    </button>
  );
}

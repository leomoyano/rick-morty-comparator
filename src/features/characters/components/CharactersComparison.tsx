"use client";

import { useState } from "react";
import type { Character } from "@/types/rick-and-morty";
import { CharacterPanel } from "./CharacterPanel";

export function CharactersComparison() {
  const [selectedCharacter1, setSelectedCharacter1] = useState<Character | null>(null);
  const [selectedCharacter2, setSelectedCharacter2] = useState<Character | null>(null);

  return (
    <section className="comparisonRoot" aria-label="Characters comparison section">
      <div className="panelsGrid">
        <CharacterPanel
          title="Character #1"
          selectedCharacterId={selectedCharacter1?.id ?? null}
          onSelectCharacter={setSelectedCharacter1}
        />
        <CharacterPanel
          title="Character #2"
          selectedCharacterId={selectedCharacter2?.id ?? null}
          onSelectCharacter={setSelectedCharacter2}
        />
      </div>

      <div className="selectionInfo" aria-live="polite">
        <strong>Selected:</strong> {selectedCharacter1?.name ?? "None"} vs {selectedCharacter2?.name ?? "None"}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import type { Character } from "@/types/rick-and-morty";
import { EpisodesComparisonBoard } from "@/features/episodes/components/EpisodesComparisonBoard";
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

      {selectedCharacter1 && selectedCharacter2 ? (
        <EpisodesComparisonBoard character1={selectedCharacter1} character2={selectedCharacter2} />
      ) : (
        <div className="stateBox" aria-live="polite">
          <p className="stateText">Select one character in each panel to see episodes comparison.</p>
        </div>
      )}
    </section>
  );
}

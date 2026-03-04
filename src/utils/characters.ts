import type { Character } from "@/types/rick-and-morty";

export function filterCharactersByName(
  characters: Character[],
  searchTerm: string
): Character[] {
  const normalizedTerm = searchTerm.trim().toLowerCase();

  if (!normalizedTerm) {
    return characters;
  }

  return characters.filter((character) => character.name.toLowerCase().includes(normalizedTerm));
}

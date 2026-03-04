import { describe, expect, it } from "vitest";
import { filterCharactersByName } from "@/utils/characters";
import type { Character } from "@/types/rick-and-morty";

const charactersFixture: Character[] = [
  {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    image: "",
    episode: []
  },
  {
    id: 2,
    name: "Morty Smith",
    status: "Alive",
    species: "Human",
    image: "",
    episode: []
  },
  {
    id: 3,
    name: "Hole in the Wall Where the Men Can See it All",
    status: "unknown",
    species: "unknown",
    image: "",
    episode: []
  }
];

describe("filterCharactersByName", () => {
  it("returns all characters when search term is empty", () => {
    const filtered = filterCharactersByName(charactersFixture, "");

    expect(filtered).toHaveLength(3);
    expect(filtered.map((character) => character.id)).toEqual([1, 2, 3]);
  });

  it("filters characters by name case-insensitively", () => {
    const filtered = filterCharactersByName(charactersFixture, "rIcK");

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe("Rick Sanchez");
  });

  it("trims spaces around the search term", () => {
    const filtered = filterCharactersByName(charactersFixture, "  morty  ");

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe("Morty Smith");
  });

  it("supports partial matches on long names", () => {
    const filtered = filterCharactersByName(charactersFixture, "where");

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(3);
  });

  it("returns empty array when no character matches", () => {
    const filtered = filterCharactersByName(charactersFixture, "summer");

    expect(filtered).toEqual([]);
  });
});

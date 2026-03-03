export type CharacterStatus = "Alive" | "Dead" | "unknown";

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  image: string;
  episode: string[];
}

export interface PageInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharacterPageResponse {
  info: PageInfo;
  results: Character[];
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
}

import type { CharacterPageResponse, Episode } from "@/types/rick-and-morty";

const API_BASE_URL = "https://rickandmortyapi.com/api";
const characterPageCache = new Map<number, CharacterPageResponse>();
const characterPageInFlight = new Map<number, Promise<CharacterPageResponse>>();

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new ApiError(`API request failed with status ${response.status}`, response.status);
  }

  return (await response.json()) as T;
}

export async function getCharacters(
  page: number,
  signal?: AbortSignal
): Promise<CharacterPageResponse> {
  if (page < 1) {
    throw new Error("Page must be greater than 0");
  }

  const cached = characterPageCache.get(page);
  if (cached) {
    return cached;
  }

  const inFlight = characterPageInFlight.get(page);
  if (inFlight && !signal) {
    return inFlight;
  }

  const request = fetchJson<CharacterPageResponse>(`${API_BASE_URL}/character?page=${page}`, signal)
    .then((payload) => {
      characterPageCache.set(page, payload);
      return payload;
    })
    .finally(() => {
      characterPageInFlight.delete(page);
    });

  if (!signal) {
    characterPageInFlight.set(page, request);
  }

  return request;
}

export async function getEpisodesByIds(ids: number[], signal?: AbortSignal): Promise<Episode[]> {
  if (ids.length === 0) {
    return [];
  }

  const uniqueSortedIds = Array.from(new Set(ids)).sort((a, b) => a - b);
  const endpoint = `${API_BASE_URL}/episode/${uniqueSortedIds.join(",")}`;
  const result = await fetchJson<Episode | Episode[]>(endpoint, signal);

  return Array.isArray(result) ? result : [result];
}

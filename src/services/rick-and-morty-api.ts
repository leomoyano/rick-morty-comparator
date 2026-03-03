import type { CharacterPageResponse, Episode } from "@/types/rick-and-morty";

const API_BASE_URL = "https://rickandmortyapi.com/api";
const characterPageCache = new Map<number, CharacterPageResponse>();
const characterPageInFlight = new Map<number, Promise<CharacterPageResponse>>();
const REQUEST_TIMEOUT_MS = 8000;

function parseRetryAfterMs(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds > 0) {
    return seconds * 1000;
  }

  return null;
}

function createTimeoutSignal(signal?: AbortSignal): {
  signal: AbortSignal;
  cleanup: () => void;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  const onAbort = () => {
    controller.abort();
  };

  if (signal) {
    signal.addEventListener("abort", onAbort, { once: true });
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeoutId);
      if (signal) {
        signal.removeEventListener("abort", onAbort);
      }
    }
  };
}

export class ApiError extends Error {
  readonly status: number;
  readonly retryAfterMs: number | null;

  constructor(message: string, status: number, retryAfterMs: number | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const { signal: timeoutSignal, cleanup } = createTimeoutSignal(signal);
  let response: Response;

  try {
    response = await fetch(url, { signal: timeoutSignal });
  } catch (error) {
    cleanup();

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("API request timeout", 408);
    }

    throw error;
  }

  cleanup();

  if (response.ok) {
    return (await response.json()) as T;
  }

  if (response.status === 429) {
    const retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after"));
    throw new ApiError("API request rate limited", 429, retryAfterMs);
  }

  throw new ApiError(`API request failed with status ${response.status}`, response.status);
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

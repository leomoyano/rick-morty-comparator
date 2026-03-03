import type { CharacterPageResponse, Episode } from "@/types/rick-and-morty";

const API_BASE_URL = "https://rickandmortyapi.com/api";
const characterPageCache = new Map<number, CharacterPageResponse>();
const characterPageInFlight = new Map<number, Promise<CharacterPageResponse>>();
const MAX_RETRIES = 1;
const REQUEST_TIMEOUT_MS = 8000;
const MAX_RETRY_DELAY_MS = 1500;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

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

function getRetryDelayMs(retryAfterMs: number | null, attempt: number): number {
  const fallbackBackoff = 400 * (attempt + 1);
  return Math.min(retryAfterMs ?? fallbackBackoff, MAX_RETRY_DELAY_MS);
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

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
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

    if (response.status === 429 && attempt < MAX_RETRIES) {
      const retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after"));
      const backoffMs = getRetryDelayMs(retryAfterMs, attempt);
      await wait(backoffMs);
      attempt += 1;
      continue;
    }

    throw new ApiError(`API request failed with status ${response.status}`, response.status);
  }

  throw new ApiError("API request failed after retries", 429);
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

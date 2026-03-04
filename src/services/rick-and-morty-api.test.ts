import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, getCharacters, getEpisodesByIds } from "@/services/rick-and-morty-api";

describe("rick-and-morty-api service", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
  });

  it("returns empty list and skips fetch when ids array is empty", async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const episodes = await getEpisodesByIds([]);

    expect(episodes).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("normalizes single episode response to array", async () => {
    const responseBody = {
      id: 10,
      name: "Close Rick-counters of the Rick Kind",
      air_date: "April 7, 2014",
      episode: "S01E10",
      characters: []
    };

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(responseBody), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );

    global.fetch = fetchMock as unknown as typeof fetch;

    const episodes = await getEpisodesByIds([10]);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://rickandmortyapi.com/api/episode/10",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
    expect(episodes).toHaveLength(1);
    expect(episodes[0].id).toBe(10);
  });

  it("deduplicates and sorts ids before requesting episodes", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );

    global.fetch = fetchMock as unknown as typeof fetch;

    await getEpisodesByIds([5, 2, 5, 3, 2]);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://rickandmortyapi.com/api/episode/2,3,5",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it("throws ApiError with retryAfterMs on 429", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response("", {
        status: 429,
        headers: { "Retry-After": "8" }
      })
    );

    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(getCharacters(1)).rejects.toMatchObject<ApiError>({
      status: 429,
      retryAfterMs: 8000
    });
  });

  it("maps aborted fetch to timeout ApiError", async () => {
    const abortError = new Error("aborted");
    abortError.name = "AbortError";

    const fetchMock = vi.fn().mockRejectedValue(abortError);
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(getCharacters(1)).rejects.toMatchObject<ApiError>({ status: 408 });
  });
});

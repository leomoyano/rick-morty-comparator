import { describe, expect, it } from "vitest";
import {
  buildEpisodeBuckets,
  computeEpisodeIdBuckets,
  mapEpisodesById
} from "@/utils/episodes";
import type { Episode } from "@/types/rick-and-morty";

function episodeUrl(id: number): string {
  return `https://rickandmortyapi.com/api/episode/${id}`;
}

describe("computeEpisodeIdBuckets", () => {
  it("computes only/shared buckets correctly", () => {
    const buckets = computeEpisodeIdBuckets(
      [episodeUrl(1), episodeUrl(2), episodeUrl(3)],
      [episodeUrl(3), episodeUrl(4)]
    );

    expect(buckets.onlyCharacter1).toEqual([1, 2]);
    expect(buckets.shared).toEqual([3]);
    expect(buckets.onlyCharacter2).toEqual([4]);
    expect(buckets.allIds).toEqual([1, 2, 3, 4]);
  });

  it("deduplicates ids and ignores invalid episode URLs", () => {
    const buckets = computeEpisodeIdBuckets(
      [episodeUrl(1), episodeUrl(1), "invalid-url", "https://rickandmortyapi.com/api/episode/nope"],
      [episodeUrl(2), episodeUrl(2), episodeUrl(1)]
    );

    expect(buckets.onlyCharacter1).toEqual([]);
    expect(buckets.shared).toEqual([1]);
    expect(buckets.onlyCharacter2).toEqual([2]);
    expect(buckets.allIds).toEqual([1, 2]);
  });

  it("returns empty buckets when both characters have no episodes", () => {
    const buckets = computeEpisodeIdBuckets([], []);

    expect(buckets.onlyCharacter1).toEqual([]);
    expect(buckets.shared).toEqual([]);
    expect(buckets.onlyCharacter2).toEqual([]);
    expect(buckets.allIds).toEqual([]);
  });
});

describe("buildEpisodeBuckets", () => {
  it("maps bucket ids to existing episodes", () => {
    const episodes: Episode[] = [
      {
        id: 1,
        name: "Pilot",
        air_date: "December 2, 2013",
        episode: "S01E01",
        characters: []
      },
      {
        id: 2,
        name: "Lawnmower Dog",
        air_date: "December 9, 2013",
        episode: "S01E02",
        characters: []
      },
      {
        id: 3,
        name: "Anatomy Park",
        air_date: "December 16, 2013",
        episode: "S01E03",
        characters: []
      }
    ];

    const episodesById = mapEpisodesById(episodes);
    const idBuckets = computeEpisodeIdBuckets([episodeUrl(1), episodeUrl(3)], [episodeUrl(3), episodeUrl(2)]);
    const buckets = buildEpisodeBuckets(episodesById, idBuckets);

    expect(buckets.onlyCharacter1.map((episode) => episode.id)).toEqual([1]);
    expect(buckets.shared.map((episode) => episode.id)).toEqual([3]);
    expect(buckets.onlyCharacter2.map((episode) => episode.id)).toEqual([2]);
  });
});

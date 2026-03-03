import type { Episode } from "@/types/rick-and-morty";

interface EpisodeIdBuckets {
  onlyCharacter1: number[];
  shared: number[];
  onlyCharacter2: number[];
  allIds: number[];
}

export interface EpisodeBuckets {
  onlyCharacter1: Episode[];
  shared: Episode[];
  onlyCharacter2: Episode[];
}

function parseEpisodeId(url: string): number | null {
  const lastSegment = url.split("/").at(-1);
  if (!lastSegment) {
    return null;
  }

  const id = Number(lastSegment);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function uniqueSortedIds(urls: string[]): number[] {
  const ids = urls
    .map(parseEpisodeId)
    .filter((id): id is number => id !== null);

  return Array.from(new Set(ids)).sort((a, b) => a - b);
}

export function computeEpisodeIdBuckets(
  character1EpisodeUrls: string[],
  character2EpisodeUrls: string[]
): EpisodeIdBuckets {
  const ids1 = uniqueSortedIds(character1EpisodeUrls);
  const ids2 = uniqueSortedIds(character2EpisodeUrls);

  const set1 = new Set(ids1);
  const set2 = new Set(ids2);

  const shared = ids1.filter((id) => set2.has(id));
  const onlyCharacter1 = ids1.filter((id) => !set2.has(id));
  const onlyCharacter2 = ids2.filter((id) => !set1.has(id));
  const allIds = [...onlyCharacter1, ...shared, ...onlyCharacter2];

  return {
    onlyCharacter1,
    shared,
    onlyCharacter2,
    allIds
  };
}

export function mapEpisodesById(episodes: Episode[]): Map<number, Episode> {
  return new Map(episodes.map((episode) => [episode.id, episode]));
}

export function buildEpisodeBuckets(
  episodesById: Map<number, Episode>,
  ids: EpisodeIdBuckets
): EpisodeBuckets {
  const toEpisodes = (bucketIds: number[]) =>
    bucketIds
      .map((id) => episodesById.get(id))
      .filter((episode): episode is Episode => episode !== undefined);

  return {
    onlyCharacter1: toEpisodes(ids.onlyCharacter1),
    shared: toEpisodes(ids.shared),
    onlyCharacter2: toEpisodes(ids.onlyCharacter2)
  };
}

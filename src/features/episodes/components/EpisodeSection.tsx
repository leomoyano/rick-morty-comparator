import type { Episode } from "@/types/rick-and-morty";

interface EpisodeSectionProps {
  title: string;
  episodes: Episode[];
}

export function EpisodeSection({ title, episodes }: EpisodeSectionProps) {
  return (
    <section className="episodesSection" aria-label={title}>
      <h3 className="episodesSectionTitle">{title}</h3>

      {episodes.length === 0 ? (
        <p className="episodesEmpty">No episodes in this group.</p>
      ) : (
        <ul className="episodesList">
          {episodes.map((episode) => (
            <li key={episode.id} className="episodeItem">
              <span className="episodeCode">{episode.episode}</span> - {episode.name} - {episode.air_date}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

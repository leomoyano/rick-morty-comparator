import { CharactersComparison } from "@/features/characters/components/CharactersComparison";

export default function HomePage() {
  return (
    <main className="page">
      <div className="container">
        <h1 className="title">Rick & Morty Episode Comparator</h1>
        <p className="subtitle">
          Select one character per list to compare their episodes.
        </p>
        <CharactersComparison />
      </div>
    </main>
  );
}

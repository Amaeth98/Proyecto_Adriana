import { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";

interface DigimonPageProps {
  reloadKey?: number;
}

export default function DigimonPage({ reloadKey }: DigimonPageProps) {
  const [digimons, setDigimons] = useState<any[]>([]);

  useEffect(() => {
    setDigimons([]);

    async function load() {
      const res = await fetch("https://digimon-api.vercel.app/api/digimon");
      const data = await res.json();

      const selected = data.sort(() => 0.5 - Math.random()).slice(0, 10);

      const mapped = selected.map((d: any) => ({
        name: d.name,
        img: d.img,
      }));

      setDigimons(mapped);
    }

    load();
  }, [reloadKey]);

  return (
    <div className="poke-container">
      <h2>Digimon</h2>

      <div className="cards-grid">
        {digimons.map((d) => (
          <PokemonCard key={d.name} pokemon={d} />
        ))}
      </div>
    </div>
  );
}

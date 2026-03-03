import { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";

interface Pokemon {
  name: string;
  url: string;
  img: string;
}

interface Props {
  gen: number;
  reloadKey: number;
}

export default function GenPage({ gen, reloadKey }: Props) {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  const ranges: Record<number, [number, number]> = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
  };

  const [min, max] = ranges[Number(gen)];

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      setPokemons([]);

      const randomIds = Array.from({ length: 10 }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
      );

      const data = await Promise.all(
        randomIds.map(async (id) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const p = await res.json();

          return {
            name: p.name,
            url: `/pokemon/${id}`,
            img: p.sprites.front_default,
          };
        })
      );

      if (!isCancelled) {
        setPokemons(data);
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [gen, reloadKey, min, max]);

  return (
    <div className="poke-container">
      <h2>Pokémon Generación {gen}</h2>

      <div className="cards-grid">
        {pokemons.map((p) => (
          <PokemonCard key={p.name} pokemon={p} />
        ))}
      </div>
    </div>
  );
}

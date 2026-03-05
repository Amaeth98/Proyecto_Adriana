"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import PokemonCard from "../../components/PokemonCard";

type Pokemon = {
  id: number;
  name: string;
  image: string;
};

export default function GenerationPage() {
  const params = useParams();
  const gen = params.gen as string;
  const { idioma, dict } = useLanguage();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGeneration() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `https://pokeapi.co/api/v2/generation/${gen}`
        );

        if (!res.ok) {
          throw new Error("Error cargando generación");
        }

        const data = await res.json();
        const selected = data.pokemon_species
          .sort(() => 0.5 - Math.random())
          .slice(0, 12);

        const pokemonsData = await Promise.all(
          selected.map(async (p: any) => {
            const res = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${p.name}`
            );
            const poke = await res.json();

            return {
              id: poke.id,
              name: poke.name,
              image:
                poke.sprites.other["official-artwork"].front_default,
            };
          })
        );

        setPokemons(pokemonsData);
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : "Error desconocido"
        );
      } finally {
        setLoading(false);
      }
    }

    loadGeneration();
  }, [gen]);

  const title =
    idioma === "es"
      ? `Generación ${gen}`
      : idioma === "en"
      ? `Generation ${gen}`
      : `Génération ${gen}`;

  if (loading) {
    return <p className="generation-loading">{dict.loading}</p>;
  }

  if (error) {
    return <p className="generation-error">{error}</p>;
  }

  return (
    <div className="generation-page">
      <h1 className="generation-title">{title}</h1>

      <div className="generation-grid">
        {pokemons.map((p) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            className="gen"
          />
        ))}
      </div>
    </div>
  );
}

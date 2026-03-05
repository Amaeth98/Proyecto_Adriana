"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

type Pokemon = {
  id: number;
  name: string;
  image: string;
};

type Props = {
  pokemon: Pokemon;
  className?: string;
};

export default function PokemonCard({ pokemon, className = "" }: Props) {
  const { dict } = useLanguage();

  return (
    <div className={`pokemon-card ${className}`}>
      <h3 className="pokemon-card__title">{pokemon.name}</h3>

      <img
        src={pokemon.image}
        alt={pokemon.name}
        className="pokemon-card__image"
      />

      <p className="pokemon-card__number">
        <b>{dict.number}:</b> {pokemon.id}
      </p>

      <div className="pokemon-card__link">
        <Link href={`/pokemon/${pokemon.id}`}>{dict.viewDetail}</Link>
      </div>
    </div>
  );
}

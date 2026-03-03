import { Link } from "react-router-dom";

interface PokemonCardProps {
  pokemon: {
    name: string;
    img: string;
    url?: string;
  };
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const hasLink = pokemon.url && pokemon.url !== "#";

  return (
    <div className="poke-card">
      <img src={pokemon.img} alt={pokemon.name} />

      <h3>{pokemon.name.toUpperCase()}</h3>

      {hasLink && (
        <Link className="btn btn-primary" to={pokemon.url!}>
          Ver más
        </Link>
      )}
    </div>
  );
}

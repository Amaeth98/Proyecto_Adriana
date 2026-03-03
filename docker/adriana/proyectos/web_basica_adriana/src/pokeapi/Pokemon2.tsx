import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface PokemonData {
  numero: number;
  nombre: string;
  img: string;
  imgJuego: string;
  imgCvg: string;
  experiencia: number;
  hp: number;
  ataque: number;
  defensa: number;
  especial: number;
}

export const Pokemon2 = () => {
  const { id } = useParams<{ id: string }>();
  const pokeId = Number(id);

  const [pokemon, setPokemon] = useState<PokemonData | null>(null);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`)
      .then((res) => res.json())
      .then((data) =>
        setPokemon({
          numero: data.id,
          nombre: data.name,
          img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
          imgJuego: data.sprites.front_default,
          imgCvg: data.sprites.other.dream_world.front_default,
          experiencia: data.base_experience,
          hp: data.stats[0].base_stat,
          ataque: data.stats[1].base_stat,
          defensa: data.stats[2].base_stat,
          especial: data.stats[3].base_stat,
        })
      );
  }, [pokeId]);

  if (!pokemon) return <p>Cargando...</p>;

  return (
    <div className="pokemon2-details">
      <h2>
        #{pokemon.numero} - {pokemon.nombre.toUpperCase()}
      </h2>

      <img src={pokemon.img} alt={pokemon.nombre} height="250" />

      <p><strong>HP:</strong> {pokemon.hp}</p>
      <p><strong>Ataque:</strong> {pokemon.ataque}</p>
      <p><strong>Defensa:</strong> {pokemon.defensa}</p>
      <p><strong>Especial:</strong> {pokemon.especial}</p>
      <p><strong>Experiencia base:</strong> {pokemon.experiencia}</p>
    </div>
  );
};

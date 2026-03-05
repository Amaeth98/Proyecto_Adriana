import PokemonCard from "./components/PokemonCard";
import HomeText from "./components/HomeText";

async function getRandomPokemon() {
  const id = Math.floor(Math.random() * 151) + 1;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error cargando Pokémon");
  }

  const data = await res.json();

  return {
    id: data.id,
    name: data.name,
    image: data.sprites.other["official-artwork"].front_default,
  };
}

{/* Inicio */}
export default async function HomePage() {
  const pokemon = await getRandomPokemon();

  return (
    <div>
      <HomeText />
      <PokemonCard pokemon={pokemon} className="home" />
    </div>
  );
}

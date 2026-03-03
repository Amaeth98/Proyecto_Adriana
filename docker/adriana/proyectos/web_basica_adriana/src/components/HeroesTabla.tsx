import heroesData from "../Fichero_heroes.json";

interface Hero {
  superhero: string;
  publisher: string;
  alter_ego: string;
  first_appearance: string;
  characters: string;
}

interface HeroesTablaProps {
  publisher: string;
}

function HeroRow({ hero }: { hero: Hero }) {
  return (
    <tr>
      <td>{hero.superhero}</td>
      <td>{hero.alter_ego}</td>
      <td>{hero.characters}</td>
      <td>{hero.first_appearance}</td>
    </tr>
  );
}

export default function HeroesTabla({ publisher }: HeroesTablaProps) {
  const heroes = (heroesData as Hero[]).filter(
    (h) => h.publisher === publisher
  );

  return (
    <div className="heroes-wrapper">
      <h3>Héroes de {publisher}</h3>

      <table className="heroes-table">
        <thead>
          <tr>
            <th>Héroe</th>
            <th>Alter ego</th>
            <th>Personaje/s</th>
            <th>Primera aparición</th>
          </tr>
        </thead>

        <tbody>
          {heroes.map((hero) => (
            <HeroRow key={hero.superhero} hero={hero} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

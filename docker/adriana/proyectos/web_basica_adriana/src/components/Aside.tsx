import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import heroes from "../fichero_heroes.json";

type Hero = {
  superhero: string;
  publisher: string;
  alter_ego?: string;
  first_appearance?: string;
  characters?: string;
  [key: string]: any;
};

export default function Aside() {
  const [heroSelected, setHeroSelected] = useState<Hero | null>(null);

  const heroesList = (heroes as Hero[]) || [];

 
  const marvelHeroes = heroesList.filter(
    (h) => h.publisher === "Marvel Comics"
  );

  return (
    <div>
      
      <div className="aside-card">
        <h3 className="aside-title">Héroes de Marvel</h3>

        <Typography
          variant="body2"
          sx={{ marginBottom: "0.5rem", opacity: 0.8 }}
        >
          Busca y selecciona tu héroe favorito de Marvel.
        </Typography>

        <Autocomplete
          options={marvelHeroes}
          fullWidth
          size="small"
          getOptionLabel={(option: Hero) => option.superhero}
          onChange={(_, value) => setHeroSelected(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Selecciona un héroe"
              variant="outlined"
            />
          )}
        />

        {heroSelected && (
          <Typography
            variant="body2"
            sx={{ marginTop: "0.75rem", fontStyle: "italic" }}
          >
            Héroe seleccionado:{" "}
            <strong>{heroSelected.superhero}</strong> (
            {heroSelected.publisher})
          </Typography>
        )}
      </div>

      <div className="aside-card">
        <h3 className="aside-title">Vídeo de YouTube</h3>
        <p style={{ fontSize: "0.9rem", marginBottom: "0.75rem" }}>
          Fotografía básica - Curso para principiantes!
        </p>

        <div className="youtube-container">
          <iframe
            src="https://www.youtube.com/embed/Ar_h-uwUvDs"
            title="Video de ejemplo de fotografía"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import NavbarPoke from "./pokeapi/NavbarPoke";
import GenPage from "./pokeapi/GenPage";
import DigimonPage from "./pokeapi/DigimonPage";
import Pagina404 from "./pokeapi/Pagina404";
import { Pokemon2 } from "./pokeapi/Pokemon2";

export default function PokeApp() {
  const [reloadIndex, setReloadIndex] = useState(0);

  const handleReload = () => {
    setReloadIndex((prev) => prev + 1);
  };

  return (
    <BrowserRouter>
      <NavbarPoke onReload={handleReload} />
      <Routes>
        <Route path="/" element={<GenPage gen={1} reloadKey={reloadIndex} />} />
        <Route path="/gen1" element={<GenPage gen={1} reloadKey={reloadIndex} />} />
        <Route path="/gen2" element={<GenPage gen={2} reloadKey={reloadIndex} />} />
        <Route path="/gen3" element={<GenPage gen={3} reloadKey={reloadIndex} />} />
        <Route path="/digimon"element={<DigimonPage reloadKey={reloadIndex} />} />
        <Route path="/pokemon/:id" element={<Pokemon2 />} />
        <Route path="*" element={<Pagina404 />} />
      </Routes>
    </BrowserRouter>
  );
}

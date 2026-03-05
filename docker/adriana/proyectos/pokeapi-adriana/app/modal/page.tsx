"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useLanguage } from "../context/LanguageContext";

function ModalPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dict } = useLanguage();
  const id = searchParams.get("id");
  const [mounted, setMounted] = useState(false);
  const [pokemon, setPokemon] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!id) {
      setError(dict.unknownError ?? "Falta el id del Pokémon");
      return;
    }

    async function loadPokemon() {
      try {
        setError(null);
        setPokemon(null);

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error(dict.errorPokemon ?? "No se pudo cargar el Pokémon");

        const data = await res.json();

        setPokemon({
          id: data.id,
          name: data.name,
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          image: data.sprites.other["official-artwork"].front_default,
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : (dict.unknownError ?? "Error desconocido"));
      }
    }

    loadPokemon();
  }, [id, dict]);

  if (!mounted) return null;

  return (
    <Modal show centered onHide={() => router.push("/")}>
      <Modal.Header closeButton>
        <Modal.Title className="text-capitalize">
          {pokemon ? pokemon.name : "Pokémon"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <p className="modal-error">{error}</p>}

        {!error && !pokemon && <p className="modal-loading">{dict.loading}</p>}

        {pokemon && (
          <>
            <div className="modal-image-wrap">
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="modal-image"
              />
            </div>
            <p className="modal-number">
              <b>{dict.number}:</b> {pokemon.id}
            </p>

            <hr />

            <div className="modal-stats">
              <div className="modal-stat">
                <b>{dict.hp}</b>
                <p>{pokemon.hp}</p>
              </div>

              <div className="modal-stat">
                <b>{dict.attack}</b>
                <p>{pokemon.attack}</p>
              </div>

              <div className="modal-stat">
                <b>{dict.defense}</b>
                <p>{pokemon.defense}</p>
              </div>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="Anterior" onClick={() => router.push(`/pokemon/${parseInt(id || "1") - 1}`)}>
          {dict.anterior}
        </Button>
        <Button variant="siguiente" onClick={() => router.push(`/pokemon/${parseInt(id || "1000") + 1}`)}>
          {dict.sigiente}
        </Button>
        <Button variant="secondary" onClick={() => router.push("/")}>
          {dict.close}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function ModalPage() {
  return (
    <Suspense fallback={null}>
      <ModalPageContent />
    </Suspense>
  );
}

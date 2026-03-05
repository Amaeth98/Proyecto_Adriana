"use client";

import { useLanguage } from "../../context/LanguageContext";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const { dict } = useLanguage();

  return (
    <div className="pokemon-error">
      <h2>{dict.errorPokemon}</h2>

      <button onClick={() => reset()}>
        {dict.retry ?? "Reintentar"}
      </button>
    </div>
  );
}

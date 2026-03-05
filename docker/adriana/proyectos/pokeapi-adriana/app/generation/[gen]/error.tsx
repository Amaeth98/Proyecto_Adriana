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
    <div className="generation-error">
      <h2>{dict.errorGeneration}</h2>

      <button onClick={() => reset()}>
        {dict.retry ?? "Reintentar"}
      </button>
    </div>
  );
}

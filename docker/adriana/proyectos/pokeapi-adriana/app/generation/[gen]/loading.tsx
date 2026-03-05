"use client";

import { useLanguage } from "../../context/LanguageContext";

export default function Loading() {
  const { dict } = useLanguage();

  return (
    <div className="loading">
      <p>{dict.loading}</p>
    </div>
  );
}

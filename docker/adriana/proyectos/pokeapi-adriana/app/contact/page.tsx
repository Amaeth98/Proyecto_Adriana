"use client";

import { useLanguage } from "../context/LanguageContext";

export default function ContactPage() {
  const { dict } = useLanguage();
  const alumno = "Adriana Amanda Lediajevaite";

  return (
    <div>
      <h1>{dict.contact}</h1>
      <p>{dict.contactText(alumno)}</p>
    </div>
  );
}

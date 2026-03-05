"use client";

import { useLanguage } from "../context/LanguageContext";

export default function HomeText() {
  const { dict } = useLanguage();
  return <h1>{dict.welcome}</h1>;
}

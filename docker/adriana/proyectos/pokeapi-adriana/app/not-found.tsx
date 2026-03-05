"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./context/LanguageContext";

export default function NotFound() {
  const { idioma, dict } = useLanguage();
  const imgSrc =
    idioma === "es"
      ? "/404-es.png"
      : idioma === "en"
      ? "/404-en.png"
      : "/404-fr.png";

  return (
    <div className="notfound">
      <h1 className="notfound__title">
        404 - {dict.notFoundTitle}
      </h1>

      <Image
        src={imgSrc}
        alt="404"
        width={420}
        height={320}
        className="notfound__image"
        priority
      />

      <p className="notfound__text">
        {dict.notFoundText}
      </p>

      <Link href="/" className="notfound__link">
        {dict.backHome}
      </Link>
    </div>
  );
}

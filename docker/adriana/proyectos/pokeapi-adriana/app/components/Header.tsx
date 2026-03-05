import Image from "next/image";

export default function Header() {
  return (
    <header className="app-header">
      <Image
        src="/header.png"
        alt="Pokémon Logo"
        width={500}
        height={120}
        className="app-header__logo"
        priority
      />
    </header>
  );
}

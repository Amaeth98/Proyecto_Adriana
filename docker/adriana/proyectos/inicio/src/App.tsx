import "./App.css";

type CardProps = { title: string; desc: string; href: string };

const Card = ({ title, desc, href }: CardProps) => (
  <a className="card" href={href} target="_blank" rel="noreferrer">
    <h2>{title}</h2>
    <p>{desc}</p>
    <span>Abrir →</span>
  </a>
);

export default function App() {
  return (
    <div className="page">
      <header className="header">
        <h1>Portfolio mis proyectos</h1>
        <p>Selecciona a dónde quieres ir</p>
      </header>

      <main className="grid">
        <Card
          title="web_basica_adriana"
          desc="React (puerto 3111)"
          href="http://localhost:3111"
        />
        <Card
          title="Pokemon_Next_Adriana"
          desc="Next.js (puerto 3112)"
          href="http://localhost:3112"
        />
        <Card
          title="Nest_API_Adriana"
          desc="Nest API (puerto 3113)"
          href="http://localhost:3113"
        />
      </main>
    </div>
  );
}
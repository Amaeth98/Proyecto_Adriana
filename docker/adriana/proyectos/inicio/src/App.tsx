import "./App.css";

type CardProps = { title: string; desc: string; href: string };

const Card = ({ title, desc, href }: CardProps) => (
  <a className="card" href={href}>
    <h2>{title}</h2>
    <p>{desc}</p>
    <span>Abrir</span>
  </a>
);

const baseHost = `${window.location.protocol}//${window.location.hostname}`;
const appUrl = (port: number) => `${baseHost}:${port}`;

export default function App() {
  return (
    <div className="page">
      <header className="header">
        <h1>Portfolio mis proyectos</h1>
        <p>Selecciona a donde quieres ir</p>
      </header>

      <main className="grid">
        <Card
          title="web_basica_adriana"
          desc="React (puerto 3111)"
          href={appUrl(3111)}
        />
        <Card
          title="Pokemon_Next_Adriana"
          desc="Next.js (puerto 3112)"
          href={appUrl(3112)}
        />
        <Card
          title="Nest_API_Adriana"
          desc="Nest API (puerto 3113)"
          href={appUrl(3113)}
        />
      </main>
    </div>
  );
}

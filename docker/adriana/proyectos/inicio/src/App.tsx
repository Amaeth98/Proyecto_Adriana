import "./App.css";

type CardProps = { title: string; desc: string; href: string };

const Card = ({ title, desc, href }: CardProps) => (
  <a className="card" href={href}>
    <h2>{title}</h2>
    <p>{desc}</p>
    <span>Abrir</span>
  </a>
);

const appUrl = (port: number, protocol: "http:" | "https:" = "http:") =>
  `${protocol}//${window.location.hostname}:${port}`;

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
          href={appUrl(3111, "http:")}
        />
        <Card
          title="Pokemon_Next_Adriana"
          desc="Next.js HTTPS (puerto 3443)"
          href={appUrl(3443, "https:")}
        />
        <Card
          title="Nest_API_Adriana"
          desc="Nest API HTTPS (puerto 3444)"
          href={appUrl(3444, "https:")}
        />
      </main>
    </div>
  );
}

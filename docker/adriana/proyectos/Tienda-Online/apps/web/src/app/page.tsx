import {
  BriefcaseBusiness,
  GraduationCap,
  Mail,
  ShieldCheck,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="home-stack">
      <section className="home-hero">
        <div className="intro">
          <p className="eyebrow">Proyecto ASIR · Fungi Decor</p>
          <h1>Adriana Amanda Lediajevaite</h1>
          <p>
            Estudiante de Administracion de Sistemas Informaticos en Red,
            responsable, adaptable y orientada al detalle. Este proyecto une mi
            perfil tecnico con una tienda online de figuras decorativas de
            setas, desarrollada con Next.js, NestJS, JWT y PostgreSQL.
          </p>
          <div className="hero-actions">
            <a className="button" href="/productos">
              Ver figuras
            </a>
            <a className="button secondary" href="mailto:sniukis98@gmail.com">
              <Mail size={17} />
              Contacto
            </a>
          </div>
        </div>
        <div className="home-visual">
          <img src="/images/setas-bosque-mini.svg" alt="Figuras decorativas de setas" />
        </div>
      </section>

      <section className="profile-grid">
        <article className="panel profile-card">
          <ShieldCheck size={22} />
          <h2>Objetivo profesional</h2>
          <p>
            Desarrollar una carrera en ciberseguridad aplicando conocimientos
            tecnicos para proteger, mantener y mejorar sistemas digitales.
          </p>
        </article>
        <article className="panel profile-card">
          <GraduationCap size={22} />
          <h2>Formacion</h2>
          <p>
            FPGS ASIR en IES Cura Valera, Huercal-Overa. Formacion actual en
            sistemas, redes, bases de datos y servicios web.
          </p>
        </article>
        <article className="panel profile-card">
          <BriefcaseBusiness size={22} />
          <h2>Experiencia</h2>
          <p>
            Practicas formativas ASIR Dual en Cosentino, con rotacion por IT,
            Helpdesk, redes, Active Directory, Azure y bases de datos.
          </p>
        </article>
      </section>
    </div>
  );
}

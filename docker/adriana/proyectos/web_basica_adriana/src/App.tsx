import Header from './components/Header';
import NavbarComponent from './components/Navbar';
import Contentsection from './components/Contentsection';
import Aside from './components/Aside';
import Footer from './components/Footer';
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import './App.css';

function Pagina404() {
  return (
    <div className="pagina-404">
      <img src="/404.jpg" alt="Página no encontrada"
      className="pagina-404-img" />
    </div>
  );
}

function NoticiasLayout() {
  return (
    <div className="noticias-layout">
      <h2>Noticias del centro</h2>
      <p>Selecciona la categoría de noticias:</p>

      <div className="noticias-menu">
        <a href="/noticias/jefatura">Jefatura de estudios</a>
        <a href="/noticias/igualdad">Plan de igualdad</a>
      </div>

      <Outlet/>
    </div>
  );
}

function NoticiasJefatura() {
  return (
    <div className="noticia-caja">
      <h3>Noticias de Jefatura de estudios</h3>
      <p>
        Información sobre Jefatura
      </p>
    </div>
  );
}

function NoticiasIgualdad() {
  return (
    <div className="noticia-caja">
      <h3>Noticias del Plan de Igualdad</h3>
      <p>
        Actividades, campañas y proyectos relacionados con la igualdad de género.
      </p>
    </div>
  );
}
export default function App() {
  return (
    <Router>
    <div className="App">
      <Header />
      <NavbarComponent />
      <main className="app-layout">
        <section className="main-section">
          <Routes>
            <Route path="/" element={<Contentsection mode="inicio" />} />
            <Route path="/fotos" element={<Contentsection mode="fotos" />} />
            <Route path="/contacto" element={<Pagina404 />} />
            <Route path="/usuario/:nombre" element={<Contentsection />} />
            <Route path="/noticias" element={<NoticiasLayout />} />
            <Route path="/noticias/jefatura" element={<NoticiasJefatura />} />
            <Route path="/noticias/igualdad" element={<NoticiasIgualdad />} />
            <Route path="*" element={<Pagina404 />} />
          </Routes>
        </section>
        <aside className="main-aside">
          <Aside />
        </aside>
      </main>
      <Footer />
    </div>
    </Router>
  );
}

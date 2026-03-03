import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { FaHouse, FaEnvelope, FaScrewdriverWrench } from "react-icons/fa6";

export default function NavbarComponent() {
  return (
    <Navbar bg="dark" variant="dark" className="navbar-custom">
      <Container className="navbar-inner">
        <Navbar.Brand href="#inicio" className="navbar-logo">
          Fotografía Adriana
        </Navbar.Brand>

        <Nav className="ms-auto nav-items">
          <NavLink to="/" className="nav-link">
            <span className="nav-icon-text">
              <FaHouse className="nav-icon" />
              Inicio
            </span>
          </NavLink>

          <NavLink to="/fotos" className="nav-link">
            <span className="nav-icon-text">
              <FaScrewdriverWrench className="nav-icon" />
              Fotos
            </span>
          </NavLink>

          <NavLink to="/contacto" className="nav-link">
            <span className="nav-icon-text">
              <FaEnvelope className="nav-icon" />
              Contacto
            </span>
          </NavLink>
        </Nav>
      </Container>
    </Navbar>
  );
}

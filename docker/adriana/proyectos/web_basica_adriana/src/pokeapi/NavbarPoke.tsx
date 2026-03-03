import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

interface NavbarPokeProps {
  onReload: () => void;
}

export default function NavbarPoke({ onReload }: NavbarPokeProps) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>Pokédex Adriana</Navbar.Brand>

        <Nav className="ms-auto">

          <NavLink className="nav-link" to="/gen1" onClick={onReload}>
            Gen 1
          </NavLink>

          <NavLink className="nav-link" to="/gen2" onClick={onReload}>
            Gen 2
          </NavLink>

          <NavLink className="nav-link" to="/gen3" onClick={onReload}>
            Gen 3
          </NavLink>

          <NavLink className="nav-link" to="/digimon" onClick={onReload}>
            Digimon
          </NavLink>

        </Nav>
      </Container>
    </Navbar>
  );
}

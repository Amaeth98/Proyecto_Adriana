"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";

export default function MyNavbar() {
  const { idioma, setIdioma, dict } = useLanguage();

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} href="/">
          Pokeapi
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">
              {dict.home}
            </Nav.Link>

            <NavDropdown title={dict.generations} id="gen-dd">
              <NavDropdown.Item as={Link} href="/generation/1">
                Gen 1
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/generation/2">
                Gen 2
              </NavDropdown.Item>
              <NavDropdown title={dict.otros} id="otros" drop="end">
                <NavDropdown.Item as={Link} href="/generation/3">
                  Gen 3
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/generation/4">
                  Gen 4
                </NavDropdown.Item>
              </NavDropdown>
            </NavDropdown>

            <Nav.Link as={Link} href="/contact">
              {dict.contact}
            </Nav.Link>
          </Nav>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className={`language-button ${
                idioma === "es" ? "active" : ""
              }`}
              onClick={() => setIdioma("es")}
            >
              <Image src="/español.png" alt="Español" width={28} height={28} />
            </button>

            <button
              className={`language-button ${
                idioma === "en" ? "active" : ""
              }`}
              onClick={() => setIdioma("en")}
            >
              <Image src="/ingles.jpg" alt="English" width={28} height={28} />
            </button>

            <button
              className={`language-button ${
                idioma === "fr" ? "active" : ""
              }`}
              onClick={() => setIdioma("fr")}
            >
              <Image src="/frances.jpg" alt="Français" width={28} height={28} />
            </button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

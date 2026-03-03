import { useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import HeroesTabla from "./HeroesTabla";

interface CardProps {
  title: string;
  text: string;
  buttonText: string;
  buttonVariant?: string;
  image: string;
  link: string;
}

interface ContentsectionProps {
  mode?: "inicio" | "fotos";
}

const InfoCard = ({
  title,
  text,
  buttonText,
  buttonVariant = "primary",
  image,
  link,
}: CardProps) => {
  return (
    <Card className="modern-card h-100">
      <Card.Img
        variant="top"
        src={image}
        alt={title}
        className="service-card-img"
      />

      <Card.Body>
        <Card.Title className="modern-card-title">{title}</Card.Title>
        <Card.Text className="modern-card-text">{text}</Card.Text>

        <Button
          variant={buttonVariant}
          as="a"
          href={link}
          target="_blank"
          rel="noreferrer"
        >
          {buttonText}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default function Contentsection({ mode = "inicio" }: ContentsectionProps) {
  
  const { nombre } = useParams<{ nombre?: string }>();

  if (nombre) {
    const nombreLimpio = decodeURIComponent(nombre).trim();
    const inicial = nombreLimpio.charAt(0).toUpperCase();

    return (
      <Container className="usuario-avatar-page">
        <div className="usuario-avatar-card">
          <Avatar className="usuario-avatar-circle">{inicial}</Avatar>
          <div className="usuario-avatar-text">
            <h2>Bienvenido, {nombreLimpio}</h2>
            <p>
              ¡Gracias por visitar Fotografía Adriana!
            </p>
          </div>
        </div>
      </Container>
    );
  }

  const cardsData: CardProps[] = [
    {
      title: "Fotografía de Paisaje",
      text: "Explora técnicas para capturar montañas, playas, bosques y amaneceres con luz natural.",
      buttonText: "Leer artículo",
      buttonVariant: "dark",
      image: "/Imagen_paisaje.jpg",
      link: "https://www.blogdefotografia.com/",
    },
    {
      title: "Fotografía Floral",
      text: "Descubre cómo capturar flores con detalle, color y composición artística utilizando luz natural.",
      buttonText: "Ver técnicas",
      buttonVariant: "primary",
      image: "/Imagen_floral.jpg",
      link: "https://www.blogdefotografia.com/",
    },
    {
      title: "Fotografía Nocturna",
      text: "Descubre cómo fotografiar estrellas, ciudades de noche y escenas con larga exposición.",
      buttonText: "Saber más",
      buttonVariant: "success",
      image: "/Imagen_noctuna.jpg",
      link: "https://www.blogdefotografia.com/",
    },
  ];

  const mostrarCards = mode === "inicio";
  const mostrarTablas = mode === "inicio";
  const mostrarCarrusel = mode === "inicio" || mode === "fotos";

  return (
    <Container>
      {mostrarCards && (
        <>
          <h2 className="mb-3" id="servicios">
            Mundo de la Fotografía
          </h2>

          <Row className="g-4 mb-5">
            {cardsData.map((card, i) => (
              <Col md={4} sm={6} xs={12} key={i}>
                <InfoCard {...card} />
              </Col>
            ))}
          </Row>
        </>
      )}

      {mostrarCarrusel && (
        <>
          <h3 className="mb-3">Galería de Andalucía</h3>

          <div className="andalucia-carousel">
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block w-100 andalucia-carousel-img"
                  src="/Almeria.jpg"
                  alt="Almería"
                />
                <Carousel.Caption>
                  <h3>Almería</h3>
                  <p>Playas volcánicas del Parque Natural Cabo de Gata.</p>
                </Carousel.Caption>
              </Carousel.Item>

              <Carousel.Item>
                <img
                  className="d-block w-100 andalucia-carousel-img"
                  src="/Cadiz.jpg"
                  alt="Cádiz"
                />
                <Carousel.Caption>
                  <h3>Cádiz</h3>
                  <p>Puestas de sol atlánticas increíbles.</p>
                </Carousel.Caption>
              </Carousel.Item>

              <Carousel.Item>
                <img
                  className="d-block w-100 andalucia-carousel-img"
                  src="/Cordoba.jpg"
                  alt="Córdoba"
                />
                <Carousel.Caption>
                  <h3>Córdoba</h3>
                  <p>Historia viva en la Mezquita-Catedral.</p>
                </Carousel.Caption>
              </Carousel.Item>

              <Carousel.Item>
                <img
                  className="d-block w-100 andalucia-carousel-img"
                  src="/granada.jpeg"
                  alt="Granada"
                />
                <Carousel.Caption>
                  <h3>Granada</h3>
                  <p>La Alhambra y el encanto del Albaicín.</p>
                </Carousel.Caption>
              </Carousel.Item>

              <Carousel.Item>
                <img
                  className="d-block w-100 andalucia-carousel-img"
                  src="/Huelva.jpg"
                  alt="Huelva"
                />
                <Carousel.Caption>
                  <h3>Huelva</h3>
                  <p>Doñana y playas infinitas.</p>
                </Carousel.Caption>
              </Carousel.Item>

              <Carousel.Item>
                <img
                  className="d-block w-100 andalucia-carousel-img"
                  src="/Jaen.jpg"
                  alt="Jaén"
                />
                <Carousel.Caption>
                  <h3>Jaén</h3>
                  <p>El mar de olivos y paisaje único.</p>
                </Carousel.Caption>
              </Carousel.Item>

              <Carousel.Item>
                <img
                  className="d-block w-100 andalucia-carousel-img"
                  src="/Malaga.jpeg"
                  alt="Málaga"
                />
                <Carousel.Caption>
                  <h3>Málaga</h3>
                  <p>Capital cultural con costa mediterránea.</p>
                </Carousel.Caption>
              </Carousel.Item>

              <Carousel.Item>
                <img
                  className="d-block w-100 andalucia-carousel-img"
                  src="/Sevilla.jpeg"
                  alt="Sevilla"
                />
                <Carousel.Caption>
                  <h3>Sevilla</h3>
                  <p>Arte, historia y tradiciones únicas.</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>
        </>
      )}

      {mostrarTablas && (
        <>
          <HeroesTabla publisher="Marvel Comics" />
          <HeroesTabla publisher="DC Comics" />
        </>
      )}
    </Container>
  );
}

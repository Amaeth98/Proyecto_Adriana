import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { LanguageProvider } from "./context/LanguageContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <LanguageProvider>
          <Header />
          <Navbar />
          <main style={{ padding: "20px" }}>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

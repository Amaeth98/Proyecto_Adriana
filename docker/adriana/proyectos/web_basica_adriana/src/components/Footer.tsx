import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="app-footer">

      <div className="footer-left">
        {new Date().getFullYear()} IES Cura Valera.
      </div>

      <div className="footer-right">
        <a href="https://www.facebook.com/p/Ies-Cura-Valera-100011212297789/?locale=es_ES" target="_blank" rel="noreferrer">
          <FaFacebookF className="footer-icon" />
        </a>

        <a href="https://www.instagram.com/ies_cura_valera/" target="_blank" rel="noreferrer">
          <FaInstagram className="footer-icon" />
        </a>

        <a href="https://www.twitter.com" target="_blank" rel="noreferrer">
          <FaTwitter className="footer-icon" />
        </a>

        <a href="https://www.youtube.com/@iescuravalerayoutube" target="_blank" rel="noreferrer">
          <FaYoutube className="footer-icon" />
        </a>
      </div>

    </footer>
  );
}

import Link from "next/link";
import Container from "../Container";
import FooterList from "./FooterList";
import { MdFacebook } from "react-icons/md";
import {
  AiFillTwitterCircle,
  AiFillInstagram,
  AiFillYoutube,
} from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="bg-slate-700 text-slate-200 text-sm mt-16">
      <Container>
        <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
          <FooterList>
            <h3 className="text-base font-bold mb-2">Categorias de la tienda</h3>
            <Link href="#">Playeras</Link>
            <Link href="#">Camisas</Link>
            <Link href="#">Polo</Link>
            <Link href="#">Paquetes</Link>
            <Link href="#">Parejas</Link>
            <Link href="#">Empresas</Link>
          </FooterList>
          <FooterList>
            <h3 className="text-base font-bold mb-2">Servicio al Cliente</h3>
            <Link href="#">Contáctenos</Link>
            <Link href="#">Politicas de envios</Link>
            <Link href="#">Devoluciones / Cambios</Link>
            <Link href="#">Preguntas frecuentes</Link>
          </FooterList>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-base font-bold mb-2">Sobre nosotros</h3>
            <p className="mb-2">
              En nuestra tienda de playeras personalizadas, nos dedicamos a ofrecerte 
              las prendas más exclusivas y originales para expresar tu estilo único. 
              Con una amplia gama de diseños, colores y tallas, estamos aquí para ayudarte 
              a crear la playera perfecta que refleje tu personalidad.
            </p>
            <p>&copy; {new Date().getFullYear()}  E~Playeras. Todos los derechos reservados.</p>
          </div>
          <FooterList>
            <h3 className="text-base font-bold mb-2">Síganos</h3>
            <div className="flex gap-2">
              <Link href="#">
                <MdFacebook size={24} />
              </Link>
              <Link href="#">
                <AiFillTwitterCircle size={24} />
              </Link>
              <Link href="#">
                <AiFillInstagram size={24} />
              </Link>
              <Link href="#">
                <AiFillYoutube size={24} />
              </Link>
            </div>
          </FooterList>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

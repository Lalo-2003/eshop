// Importación de componentes y funciones necesarias
import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import AddProductForm from "./AddProductForm";
import getCurrentUser from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";

// Componente asíncrono para añadir productos
const AddProducts = async () => {
  // Obtención del usuario actual
  const currentUser = await getCurrentUser();

  // Verificación del rol del usuario
  if (!currentUser || currentUser.role !== "ADMIN") {
    // Si no hay usuario o el rol no es "ADMIN", se muestra un mensaje de acceso denegado
    return <NullData title="¡Ups! Acceso denegado" />;
  }

  // Renderización del formulario para añadir productos dentro de contenedores estilizados
  return (
    <div className="p-8">
      <Container>
        <FormWrap>
          <AddProductForm />
        </FormWrap>
      </Container>
    </div>
  );
};

export default AddProducts;

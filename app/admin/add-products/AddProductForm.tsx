"use client";

// Importación de componentes y librerías
import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import Input from "@/app/components/inputs/Input";
import SelectColor from "@/app/components/inputs/SelectColor";
import TextArea from "@/app/components/inputs/TextArea";
import firebaseApp from "@/libs/firebase";
import { categories } from "@/utils/Categories";
import { colors } from "@/utils/Colors";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";
import { useRouter } from "next/navigation";

// Definición de tipos para las imágenes
export type ImageType = {
  color: string;
  colorCode: string;
  image: File | null;
};

export type UploadedImageType = {
  color: string;
  colorCode: string;
  image: string;
};

const AddProductForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [images, setImages] = useState<ImageType[] | null>(); // Estado para las imágenes
  const [isProductCreated, setIsProductCreated] = useState(false); // Estado para indicar si el producto fue creado

  // Configuración del formulario con react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      inStock: false,
      images: [],
      price: "",
    },
  });

  // Efecto para actualizar las imágenes en el formulario
  useEffect(() => {
    setCustomValue("images", images);
  }, [images]);

  // Efecto para reiniciar el formulario cuando el producto se crea
  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages(null);
      setIsProductCreated(false);
    }
  }, [isProductCreated]);

  // Función para manejar el envío del formulario
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("Product Data", data);
    setIsLoading(true); // Inicia el estado de carga
    let uploadedImages: UploadedImageType[] = []; // Array para almacenar las imágenes subidas

    // Validación de categoría
    if (!data.category) {
      setIsLoading(false);
      return toast.error("¡No seleccionaste una categoria!");
    }

    // Validación de imágenes
    if (!data.images || data.images.length === 0) {
      setIsLoading(false);
      return toast.error("¡No seleccionaste una imagen!");
    }

    // Función para manejar la carga de imágenes a Firebase Storage
    const handleImageUploads = async () => {
      toast("Creando producto, por favor espere..");
      try {
        for (const item of data.images) {
          if (item.image) {
            const fileName = new Date().getTime() + "-" + item.image.name;
            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, `products/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, item.image);

            await new Promise<void>((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log("Upload is " + progress + "% done");
                  switch (snapshot.state) {
                    case "paused":
                      console.log("La carga está en pausa");
                      break;
                    case "running":
                      console.log("La carga se está ejecutando");
                      break;
                  }
                },
                (error) => {
                  console.log("Error al subir imagen", error);
                  reject(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                      uploadedImages.push({
                        ...item,
                        image: downloadURL,
                      });
                      console.log("Archivo disponible en", downloadURL);
                      resolve();
                    })
                    .catch((error) => {
                      console.log("Error al obtener la URL de descarga", error);
                      reject(error);
                    });
                }
              );
            });
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.log("Error al cargar imágenes", error);
        return toast.error("Error al cargar imágenes");
      }
    };

    await handleImageUploads(); // Ejecuta la carga de imágenes
    const productData = { ...data, images: uploadedImages }; // Prepara los datos del producto

    // Envío de los datos del producto a la API
    axios
      .post("/api/product", productData)
      .then(() => {
        toast.success("Producto creado");
        setIsProductCreated(true); // Indica que el producto fue creado
        router.refresh(); // Refresca la página
      })
      .catch((error) => {
        toast.error("Algo salió mal al guardar el producto en la base de datos.");
      })
      .finally(() => {
        setIsLoading(false); // Termina el estado de carga
      });
  };

  const category = watch("category"); // Observa cambios en la categoría seleccionada

  // Función para actualizar valores del formulario
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // Función para agregar una imagen al estado de imágenes
  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) {
        return [value];
      }

      return [...prev, value];
    });
  }, []);

  // Función para eliminar una imagen del estado de imágenes
  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) {
        const filteredImages = prev.filter(
          (item) => item.color !== value.color
        );
        return filteredImages;
      }

      return prev;
    });
  }, []);

  return (
    <>
      <Heading title="Añadir Producto" center />
      <Input
        id="name"
        label="Nombre"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="price"
        label="Precio"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="number"
        required
      />
      <Input
        id="brand"
        label="Marca"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <TextArea
        id="description"
        label="Descripción"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <CustomCheckBox
        id="inStock"
        register={register}
        label="Producto disponible (In Stock)"
      />
      <div className="w-full font-medium">
        <div className="mb-2 font-semibold">Selecciona una Categoria</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h[50vh] overflow-y-auto">
          {categories.map((item) => {
            if (item.label === "All") {
              return null;
            }

            return (
              <div key={item.label} className="col-span">
                <CategoryInput
                  onClick={(category) => setCustomValue("category", category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
          <div className="font-bold">
            Seleccione los colores de producto disponibles y cargue sus imágenes.
          </div>
          <div className="text-sm">
            Debe cargar una imagen para cada uno de los colores seleccionados, 
            de lo contrario se ignorará su selección de color.
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {colors.map((item, index) => {
            return (
              <SelectColor
                key={index}
                item={item}
                addImageToState={addImageToState}
                removeImageFromState={removeImageFromState}
                isProductCreated={isProductCreated}
              />
            );
          })}
        </div>
      </div>
      <Button
        label={isLoading ? "Cargando..." : "Agregar producto"}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default AddProductForm;

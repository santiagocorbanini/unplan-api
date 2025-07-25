import { useState } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "react-bootstrap";
import { FileUploader } from "react-drag-drop-files";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { createShow } from "../../services/shows.js";

const ModalAgregar = ({ showModal, toggleModal, getShows }) => {
    const validationSchema = Yup.object().shape({
        title: Yup.string().required("El nombre es obligatorio"),
        event_date: Yup.date().required("La fecha del evento es obligatoria"),
        image: Yup.mixed(),
    });

    const fileTypes = ["JPG", "JPEG"];
    const [file, setFile] = useState(null);
    const [categories, setCategories] = useState([]);

    const handleCategoryChange = (category) => {
        setCategories((prevCategories) =>
            prevCategories.includes(category)
                ? prevCategories.filter((c) => c !== category)
                : [...prevCategories, category]
        );
    };

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("venue", values.venue);
            formData.append("url", values.url);
            formData.append("event_date", values.event_date);
            formData.append("address", values.address || "");
            formData.append("instagram", values.instagram || "");
            formData.append("web", values.web || "");

            // Imagen
            if (file) {
                formData.append("flyer", file);
            }

            // Enviar cada categoría como entrada separada
            categories.forEach((cat) => {
                formData.append("categories", cat);
            });

            await createShow(formData);

            Swal.fire({
                title: "Evento agregado",
                text: "El evento se ha agregado correctamente.",
                icon: "success",
            });

            toggleModal();
            getShows();
        } catch (error) {
            console.error("Error al crear el evento:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo agregar el evento.",
                icon: "error",
            });
        }
    };


    const handleChange = (file) => {
        /*
        if (file.size > 1048576) {
            Swal.fire({
                title: "Error",
                text: "La imagen debe tener un tamaño de hasta 1MB.",
                icon: "error",
            });
        } else {
            setFile(file);
        }*/
    };

    return (
        <Modal show={showModal} onHide={toggleModal} centered>
            <ModalHeader>
                <strong className="text-uppercase">Agregar Nuevo Evento</strong>
            </ModalHeader>
            <ModalBody>
                <Formik
                    initialValues={{
                        title: "",
                        venue: "",
                        url: "",
                        event_date: "",
                        image: "",
                        address: "",
                        instagram: "",
                        web: ""
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values }) => (
                        <Form>
                            {/* title */}
                            <div className="form-group">
                                <label className="mb-1" htmlFor="title">
                                    Evento
                                </label>
                                <Field
                                    placeholder="Ingrese el nombre del evento"
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="form-control mb-2"
                                />
                                <ErrorMessage
                                    name="title"
                                    component="div"
                                    className="text-danger"
                                />
                            </div>

                            {/* venue */}
                            <div className="form-group">
                                <label className="mb-1" htmlFor="venue">
                                    Lugar
                                </label>
                                <Field
                                    placeholder="Ingrese el nombre del lugar"
                                    type="text"
                                    id="venue"
                                    name="venue"
                                    className="form-control mb-2"
                                />
                                <ErrorMessage
                                    name="venue"
                                    component="div"
                                    className="text-danger"
                                />
                            </div>

                            {/* address */}
                            <div className="form-group">
                                <label className="mb-1" htmlFor="address">
                                    Dirección
                                </label>
                                <Field
                                    placeholder="Ingrese la dirección del evento"
                                    type="text"
                                    id="address"
                                    name="address"
                                    className="form-control mb-2"
                                />
                            </div>

                            {/* url */}
                            <div className="form-group">
                                <label className="mb-1" htmlFor="url">
                                    URL de entradas
                                </label>
                                <Field
                                    placeholder="Ingrese la URL de entradas"
                                    type="text"
                                    id="url"
                                    name="url"
                                    className="form-control mb-2"
                                />
                                <ErrorMessage
                                    name="url"
                                    component="div"
                                    className="text-danger"
                                />
                            </div>

                            {/* instagram */}
                            <div className="form-group">
                                <label className="mb-1" htmlFor="instagram">
                                    Instagram
                                </label>
                                <Field
                                    placeholder="Ingrese el usuario de Instagram"
                                    type="text"
                                    id="instagram"
                                    name="instagram"
                                    className="form-control mb-2"
                                />
                            </div>

                            {/* web */}
                            <div className="form-group">
                                <label className="mb-1" htmlFor="web">
                                    Sitio web
                                </label>
                                <Field
                                    placeholder="Ingrese la URL del sitio web"
                                    type="text"
                                    id="web"
                                    name="web"
                                    className="form-control mb-2"
                                />
                            </div>

                            {/* event_date */}
                            <div className="form-group">
                                <label className="mb-1" htmlFor="event_date">
                                    Fecha del Evento
                                </label>
                                <Field
                                    type="date"
                                    id="event_date"
                                    name="event_date"
                                    className="form-control mb-2"
                                />
                                <ErrorMessage
                                    name="event_date"
                                    component="div"
                                    className="text-danger"
                                />
                            </div>

                            {/* categories */}
                            <div className="form-group">
                                <label className="mb-1">Categorías</label>
                                <div className="d-flex gap-2">
                                    <Button
                                        variant={
                                            categories.includes("Aire Libre")
                                                ? "primary"
                                                : "outline-primary"
                                        }
                                        onClick={() => handleCategoryChange("Aire Libre")}
                                    >
                                        Aire Libre
                                    </Button>
                                    <Button
                                        variant={
                                            categories.includes("Teatro")
                                                ? "primary"
                                                : "outline-primary"
                                        }
                                        onClick={() => handleCategoryChange("Teatro")}
                                    >
                                        Teatro
                                    </Button>
                                    {/* Agrega más categorías según necesites */}
                                </div>
                            </div>

                            {/* image */}
                            <div className="form-group">
                                <label className="mb-1" htmlFor="image">
                                    Flyer
                                </label>
                                <FileUploader
                                    handleChange={handleChange}
                                    name="image"
                                    types={fileTypes}
                                    multiple={false}
                                    label="Arrastre o suba una imagen"
                                    hoverTitle="Arrastre aquí"
                                />
                                <ErrorMessage
                                    name="image"
                                    component="div"
                                    className="text-danger"
                                />
                            </div>

                            <ModalFooter className="d-flex gap-2 justify-content-center">
                                <Button
                                    style={{ width: "40%" }}
                                    variant="secondary"
                                    onClick={toggleModal}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    style={{ width: "40%" }}
                                    variant="primary"
                                    type="submit"
                                >
                                    Agregar
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </ModalBody>
        </Modal>
    );
};

export default ModalAgregar;
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
    const [categories, setCategories] = useState([]); // Estado para las categorías

    const handleCategoryChange = (category) => {
        setCategories((prevCategories) =>
            prevCategories.includes(category)
                ? prevCategories.filter((c) => c !== category) // Quitar si ya está seleccionado
                : [...prevCategories, category] // Agregar si no está seleccionado
        );
    };

    const handleSubmit = async (values) => {
        try {
            const showData = {
                ...values,
                categories, // Agregar categorías seleccionadas
            };
            await createShow(showData);
            Swal.fire({
                title: "Evento agregado",
                text: "El evento se ha agregado correctamente.",
                icon: "success",
            });
            toggleModal();
            getShows();
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo agregar el evento.",
                icon: "error",
            });
        }
    };

    const handleChange = (file) => {
        if (file.size > 1048576) {
            Swal.fire({
                title: "Error",
                text: "La imagen debe tener un tamaño de hasta 1MB.",
                icon: "error",
            });
        } else {
            setFile(file);
        }
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
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
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
                        {/* url */}
                        <div className="form-group">
                            <label className="mb-1" htmlFor="url">
                                URL
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
                </Formik>
            </ModalBody>
        </Modal>
    );
};

export default ModalAgregar;

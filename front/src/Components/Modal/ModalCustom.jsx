import {
    Modal,
    ModalHeader,
    ModalBody,
    Button,
    ModalFooter,
} from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import { createShow, updateShow } from "../../services/shows.js";

const ModalCustom = ({ showModal, toggleModal, getShows, selectedEvent }) => {
    const isEditMode = !!selectedEvent;

    const categoryOptions = [
        "Evento",
        "Gastronomía",
        "Música",
        "Teatro",
        "Feria",
        "Gratis",
        "Aire Libre",
    ];

    const formatDateTime = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
            d.getDate()
        ).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(
            d.getMinutes()
        ).padStart(2, "0")}`;
    };

    // Función para formatear solo la fecha
    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
            d.getDate()
        ).padStart(2, "0")}`;
    };

    const handleSubmit = async (values) => {
        console.log("entro con estas categorias:", values.categories);
        //const newCategories = values.categories
        //    ? `{${values.categories.split(",").map(item => item.trim()).join(",")}}`
        //    : null;
        // Luego pasarlo a tu API

        //values.categories = newCategories

        const payload = {
            ...values,
            categories: `{${values.categories.join(",")}}`, // convierte a formato {Música,Teatro}
        };
        try {
            if (isEditMode) {
                // Llamar a updateShow
                await updateShow(selectedEvent.show_id, payload);
                Swal.fire({
                    title: "Evento editado",
                    text: "El evento se ha editado correctamente.",
                    icon: "success",
                });
            } else {
                // Llamar a createShow
                await createShow(payload);
                Swal.fire({
                    title: "Evento agregado",
                    text: "El evento se ha agregado correctamente.",
                    icon: "success",
                });
            }

            toggleModal();
            getShows();
        } catch (error) {
            console.error(
                `Error al ${isEditMode ? "editar" : "agregar"} el evento:`,
                error.message
            );

            Swal.fire({
                title: "Error",
                text: `Hubo un problema al ${isEditMode ? "editar" : "agregar"} el evento.`,
                icon: "error",
            });
        }
    };


    const handleChange = (event, formikprops) => {
        const file = event.currentTarget.files[0];

        if (!file) {
            // El usuario ha cancelado la selección, no hay archivo seleccionado
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5 MB = 5 * 1024 * 1024 bytes
            Swal.fire({
                title: "Error",
                text: "La imagen debe tener un tamaño de hasta 5MB.",
                icon: "error",
            });
        } else {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result; // Contiene la imagen en base64
                if (base64data && base64data.startsWith("data:image")) {
                    console.log(
                        "Conversión a base64 exitosa. Valor de base64data:",
                        base64data
                    );
                    formikprops.setFieldValue("flyer", base64data); // Asigna la imagen al campo "flyer" del formulario
                } else {
                    console.log(
                        "Hubo un problema con la conversión a base64. Valor de base64data:",
                        base64data
                    );
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal show={showModal} onHide={toggleModal} centered>
            <ModalHeader>
                <strong className="text-uppercase">
                    {isEditMode ? "Editar Evento" : "Agregar Nuevo Evento"}
                </strong>
            </ModalHeader>
            <ModalBody>
                <Formik
                    initialValues={{
                        title: selectedEvent?.title || "",
                        city: selectedEvent?.city || "",
                        venue: selectedEvent?.venue || "",
                        url: selectedEvent?.url || "",
                        event_date: selectedEvent?.event_date ? formatDate(selectedEvent.event_date) : "",
                        flyer: selectedEvent?.flyer || "",
                        categories: selectedEvent?.categories || [],
                    }}
                    onSubmit={handleSubmit}
                >
                    {(formikProps) => (
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
                            {/* city 
                            <div className="form-group">
                                <label className="mb-1" htmlFor="city">
                                    Ciudad
                                </label>
                                <Field
                                    placeholder="Ingrese el nombre de la ciudad"
                                    type="text"
                                    id="city"
                                    name="city"
                                    className="form-control mb-2"
                                />
                                <ErrorMessage
                                    name="city"
                                    component="div"
                                    className="text-danger"
                                />
                            </div>
                            */}
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
                                    placeholder="Ingrese la url de entradas"
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
                            {/* start_date 
                            <div className="form-group">
                                <label className="mb-1" htmlFor="start_date">
                                    Visible desde
                                </label>
                                <Field
                                    type="datetime-local"
                                    id="start_date"
                                    name="start_date"
                                    className="form-control mb-2"
                                />
                                <ErrorMessage
                                    name="start_date"
                                    component="div"
                                    className="text-danger"
                                />
                            </div> */}
                            {/* end_date 
                            <div className="form-group">
                                <label className="mb-1" htmlFor="end_date">
                                    Visible hasta
                                </label>
                                <Field
                                    type="datetime-local"
                                    id="end_date"
                                    name="end_date"
                                    className="form-control mb-2"
                                />
                                <ErrorMessage
                                    name="end_date"
                                    component="div"
                                    className="text-danger"
                                />
                            </div> */}
                            <div className="form-group">
                                <label className="mb-1" htmlFor="categories">
                                    Categorías
                                </label>
                                <div className="form-group">
                                    <label className="mb-1">Categorías</label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {categoryOptions.map((category) => (
                                            <div key={category} className="form-check">
                                                <input
                                                    type="checkbox"
                                                    id={category}
                                                    name="categories"
                                                    value={category}
                                                    checked={formikProps.values.categories.includes(category)}
                                                    onChange={(e) => {
                                                        const { checked, value } = e.target;
                                                        if (checked) {
                                                            formikProps.setFieldValue("categories", [
                                                                ...formikProps.values.categories,
                                                                value,
                                                            ]);
                                                        } else {
                                                            formikProps.setFieldValue(
                                                                "categories",
                                                                formikProps.values.categories.filter((c) => c !== value)
                                                            );
                                                        }
                                                    }}
                                                    className="form-check-input"
                                                />
                                                <label htmlFor={category} className="form-check-label ms-1">
                                                    {category}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <ErrorMessage name="categories" component="div" className="text-danger" />
                                </div>

                                <ErrorMessage
                                    name="categories"
                                    component="div"
                                    className="text-danger"
                                />
                            </div>
                            {/* flyer */}
                            <div className="form-group">
                                <label className="mb-1" htmlFor="flyer">
                                    Flyer
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleChange(e, formikProps)}
                                    className="form-control mb-2"
                                    name="flyer"
                                />
                                <ErrorMessage
                                    name="flyer"
                                    component="div"
                                    className="text-danger"
                                />
                                {/* Si hay flyer, mostrar la vista previa */}
                                {selectedEvent?.flyer?.data && (
                                    <div className="mb-2">
                                        <img
                                            src={`data:image/png;base64,${btoa(
                                                new Uint8Array(selectedEvent.flyer.data).reduce(
                                                    (data, byte) => data + String.fromCharCode(byte),
                                                    ""
                                                )
                                            )}`}
                                            alt="Placeholder"
                                            width="100%"
                                        />
                                    </div>
                                )}
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
                                    {isEditMode ? "Actualizar Evento" : "Crear Evento"}
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </ModalBody>
        </Modal>
    );
};

export default ModalCustom;

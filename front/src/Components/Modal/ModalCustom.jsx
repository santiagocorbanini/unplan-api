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
        try {
            const formData = new FormData();

            formData.append("title", values.title);
            formData.append("venue", values.venue);
            formData.append("city", values.city);
            formData.append("url", values.url);
            formData.append("event_date", values.event_date);
            formData.append("address", values.address);
            formData.append("instagram", values.instagram);
            formData.append("web", values.web);
            formData.append("categories", JSON.stringify(values.categories));

            if (values.flyerFile) {
                formData.append("flyer", values.flyerFile); // clave "flyer" es la usada por multer
            }

            if (isEditMode) {
                await updateShow(selectedEvent.show_id, formData); // importante: también debe aceptar FormData
                Swal.fire("Editado", "El evento fue actualizado.", "success");
            } else {
                await createShow(formData);
                Swal.fire("Agregado", "El evento fue creado.", "success");
            }

            toggleModal();
            getShows();
        } catch (error) {
            console.error("Error al enviar el evento:", error);
            Swal.fire("Error", "No se pudo procesar el evento.", "error");
        }
    };


    const handleChange = (event, formikprops) => {
        const file = event.currentTarget.files[0];

        if (!file) return;

        /*
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire("Error", "La imagen no debe superar 5MB", "error");
            return;
        }*/

        formikprops.setFieldValue("flyerFile", file); // guardamos el archivo real
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
                        categories: selectedEvent?.categories || [],
                        address: selectedEvent?.address || "",
                        instagram: selectedEvent?.instagram || "",
                        web: selectedEvent?.web || "",
                        flyerFile: null,
                        image_url: selectedEvent?.image_url || ""
                    }}
                    onSubmit={handleSubmit}
                >
                    {(formikProps) => (
                        <Form>
                            {/* title */}
                            <div className="form-group">
                                <label className="mb-1" htmlFor="title">
                                    Evento *
                                </label>
                                <Field
                                    placeholder="Nombre del evento (Feria .., Andres Calamaro, etc.)"
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
                            {/* event_date */}
                            <div className="form-group">
                                <label className="mb-1" htmlFor="event_date">
                                    Fecha del Evento *
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
                                    Lugar *
                                </label>
                                <Field
                                    placeholder="Nombre del lugar (Teatro San Carlos, City Rock, etc.)"
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
                                    placeholder="Dirección del lugar (Calle, Número, etc.)"
                                    type="text"
                                    id="address"
                                    name="address"
                                    className="form-control mb-2"
                                />
                                <ErrorMessage
                                    name="address"
                                    component="div"
                                    className="text-danger"
                                />
                            </div>

                            {/* url */}
                            <div className="form-group">
                                <label className="mb-1" htmlFor="url">
                                    URL de entradas *
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

                            {/* instagram */}
                            <div className="form-group">
                                <label className="mb-1" htmlFor="instagram">
                                    Instagram
                                </label>
                                <Field
                                    placeholder="Ingrese el perfil de Instagram"
                                    type="text"
                                    id="instagram"
                                    name="instagram"
                                    className="form-control mb-2"
                                />
                                <ErrorMessage
                                    name="instagram"
                                    component="div"
                                    className="text-danger"
                                />
                            </div>

                            {/* web */}
                            <div className="form-group">
                                <label className="mb-1" htmlFor="web">
                                    Sitio web
                                </label>
                                <Field
                                    placeholder="URL del sitio web si tiene"
                                    type="text"
                                    id="web"
                                    name="web"
                                    className="form-control mb-2"
                                />
                                <ErrorMessage
                                    name="web"
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
                                    Categorías (máximo 3) *
                                </label>
                                <div className="form-group">
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
                                                            // Verificar que no se exceda el límite de 3 categorías
                                                            if (formikProps.values.categories.length >= 3) {
                                                                Swal.fire({
                                                                    title: "Límite alcanzado",
                                                                    text: "Solo puedes seleccionar hasta 3 categorías",
                                                                    icon: "warning",
                                                                });
                                                                return;
                                                            }
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
                                                    disabled={
                                                        !formikProps.values.categories.includes(category) &&
                                                        formikProps.values.categories.length >= 3
                                                    }
                                                />
                                                <label htmlFor={category} className="form-check-label ms-1">
                                                    {category}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <small className="text-muted">
                                        Seleccionadas: {formikProps.values.categories.length}/3
                                    </small>
                                    <ErrorMessage name="categories" component="div" className="text-danger" />
                                </div>
                            </div>
                            {/* flyer */}
                            {/* flyer */}
                            <div className="form-group">
                                <label className="mb-1" htmlFor="flyer">
                                    Flyer *
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
                                {/* Mostrar la imagen existente desde la URL */}
                                {formikProps.values.image_url && (
                                    <div className="mb-2">
                                        <img
                                            src={formikProps.values.image_url}
                                            alt="Flyer actual"
                                            width="100%"
                                            style={{ maxHeight: "300px", objectFit: "contain" }}
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
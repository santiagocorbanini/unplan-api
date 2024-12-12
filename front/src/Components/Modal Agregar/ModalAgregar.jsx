import { useState } from "react"
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "react-bootstrap"
import { FileUploader } from "react-drag-drop-files"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import axios from "axios"
import Swal from "sweetalert2"
import { createShow } from "../../services/shows.js";

const ModalAgregar = ({ showModal, toggleModal, getShows }) => {
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("El nombre es obligatorio"),
        start_date: Yup.date().required("La fecha de inicio es obligatoria"),
        end_date: Yup.date().required("La fecha de fin es obligatoria"),
        image: Yup.mixed(),
        end_date: Yup.date().min(
            Yup.ref("start_date"),
            "La fecha de finalización debe ser posterior a la de inicio"
        ),
    })

    const fileTypes = ["JPG", "JPEG"]

    const [file, setFile] = useState(null)

    const handleSubmit = async (values) => {
        try {
            await createShow(values);
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
        // Validar el tamaño del archivo -- MAX 1MB --
        if (file.size > 1048576) {
            Swal.fire({
                title: "Error",
                text: "La imagen debe tener un tamaño de hasta 1MB.",
                icon: "error",
            })
        } else {
            setFile(file)
        }
    }

    return (
        <Modal show={showModal} onHide={toggleModal} centered>
            <ModalHeader>
                <strong className="text-uppercase">Agregar Nuevo Evento</strong>
            </ModalHeader>
            <ModalBody>
                <Formik
                    initialValues={{
                        title: "",
                        city: "",
                        venue: "",
                        url: "",
                        event_date: "",
                        start_date: "",
                        end_date: "",
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
                        {/* city */}
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
                                name="dateEvent"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        {/* start_date */}
                        <div className="form-group">
                            <label className="mb-1" htmlFor="startDate">
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
                        </div>
                        {/* end_date */}
                        <div className="form-group">
                            <label className="mb-1" htmlFor="endDate">
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
    )
}

export default ModalAgregar

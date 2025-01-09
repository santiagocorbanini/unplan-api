import React, { useState, useEffect } from "react";
import { Button, Container, Table, Modal } from "react-bootstrap";
import { FaCopy } from "react-icons/fa"; // Importar el ícono de copiar
import Swal from "sweetalert2";
import axios from "axios";
import { format } from "date-fns";
import "./Table.scss";
import ModalCustom from "../Modal/ModalCustom";
import { getAllShows, deleteShowId } from "../../services/shows.js";

const TableShows = () => {
    const [shows, setShows] = useState([]);
    const [selectedShow, setSelectedShow] = useState(null);
    const [showName, setShowName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Estado para el modal de agregar evento
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const getShows = async () => {
        try {
            const response = await getAllShows();
            setShows(response.data);
        } catch (error) {
            console.error("Error al obtener los shows:", error);
        }
    };

    const showDeleteConfirmation = (id, name) => {
        setSelectedShow(id);
        setShowName(name);
    };

    const deleteShow = async (id) => {
        try {
            const response = await deleteShowId(selectedShow);
            if (response.status === 200) {
                console.log(`Show con ID ${id} eliminado exitosamente`);
                getShows();
            } else {
                console.error(
                    `Error al eliminar el show con ID ${id}. Estado de respuesta: ${response.status}`
                );
            }
        } catch (error) {
            console.error(`Error al eliminar el show con ID ${id}:`, error.message);
        }
    };

    const confirmDeleteShow = async () => {
        try {
            await deleteShow(selectedShow);
            Swal.fire({
                title: "Evento eliminado",
                text: "El evento se ha eliminado correctamente.",
                icon: "success",
            });
            setSelectedShow(null);
            setShowName("");
        } catch (error) {
            console.error("Error al eliminar el show:", error);
            Swal.fire({
                title: "Error",
                text: "Ha ocurrido un error al eliminar el evento.",
                icon: "error",
            });
        }
    };

    useEffect(() => {
        getShows();
    }, []);

    return (
        <>
            <Container>
                <Button
                    className="button-custom w-100 mb-3 mt-2 d-flex justify-content-center align-items-center"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Agregar Evento
                </Button>
            </Container>
            <Container className="table">
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Evento</th>
                            <th scope="col">Fecha</th>
                            {/* <th scope="col">Ciudad</th> */}
                            <th scope="col">Lugar</th>
                            {/* <th scope="col">📅 Desde</th> */}
                            {/* <th scope="col">📅 Hasta</th> */}
                            <th scope="col">URL</th>
                            <th scope="col">Imagen</th>
                            <th scope="col" className="text-center">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {shows.map((show, index) => (
                            <tr key={index}>
                                <td style={{ verticalAlign: "middle" }}>{show.show_id}</td>
                                <td style={{ verticalAlign: "middle" }}>{show.title}</td>
                                <td style={{ verticalAlign: "middle" }}>
                                    {show.event_date &&
                                        format(new Date(show.event_date), "dd/MM/yyyy")}
                                </td>
                                {/* <td style={{ verticalAlign: "middle" }}>{show.city}</td> */}
                                <td style={{ verticalAlign: "middle" }}>{show.venue}</td>
                                {/* <td style={{ verticalAlign: "middle" }}>
                                    {show.event_date &&
                                        format(new Date(show.start_date), "dd/MM/yyyy HH:mm")}
                                </td> */}
                                {/* <td style={{ verticalAlign: "middle" }}>
                                    {show.event_date &&
                                        format(new Date(show.end_date), "dd/MM/yyyy HH:mm")}
                                </td> */}
                                <td style={{ verticalAlign: "middle" }}>
                                    {show.url && (
                                        <>
                                            <span title={show.url}>
                                                {show.url.length > 15
                                                    ? `${show.url.slice(0, 15)}...`
                                                    : show.url}
                                            </span>
                                            <FaCopy
                                                className="copy-icon"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(show.url);
                                                    Swal.fire({
                                                        title: "URL Copiada",
                                                        text: "La URL se ha copiado al portapapeles",
                                                        icon: "success",
                                                        timer: 1500,
                                                        showConfirmButton: false,
                                                    });
                                                }}
                                            />
                                        </>
                                    )}
                                </td>
                                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                                    {show.flyer?.data ? (
                                        <img
                                            src={`data:image/jpg;base64,${btoa(
                                                new Uint8Array(show.flyer.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
                                            )}`}
                                            alt="Flyer"
                                            width={100}
                                        />
                                    ) : (
                                        <span>Sin imagen</span>
                                    )}
                                </td>
                                <td className="text-center align-content-center">
                                    <Button
                                        onClick={() => {
                                            setSelectedEvent(show); // Establecer el evento seleccionado
                                            setIsEditModalOpen(true); // Abrir el modal de edición
                                        }}
                                        className="table-buttons m-1"
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            showDeleteConfirmation(show.show_id, show.title)
                                        }
                                        variant="danger"
                                        className="table-buttons m-1"
                                    >
                                        Borrar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <ModalCustom
                    showModal={isAddModalOpen}
                    toggleModal={() => setIsAddModalOpen(false)}
                    getShows={getShows}
                    selectedEvent={null}
                />

                {/* Modal para editar evento */}
                <ModalCustom
                    showModal={isEditModalOpen}
                    toggleModal={() => setIsEditModalOpen(false)}
                    getShows={getShows}
                    selectedEvent={selectedEvent} // Pasa el evento seleccionado para editar al modal
                />
                <Modal
                    centered
                    show={selectedShow !== null}
                    onHide={() => setSelectedShow(null)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar eliminación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        ¿Está seguro de que desea eliminar el show{" "}
                        <strong>{showName}</strong>?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setSelectedShow(null)}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={confirmDeleteShow}>
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};

export default TableShows;

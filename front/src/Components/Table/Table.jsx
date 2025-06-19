import React, { useState, useEffect } from "react";
import { Button, Container, Table, Modal } from "react-bootstrap";
import { FaCopy, FaInstagram, FaGlobe, FaMapMarkerAlt, FaEdit, FaTrash, FaTag } from "react-icons/fa";
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
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
                            <th scope="col">Imagen*</th>
                            <th scope="col">Evento*</th>
                            <th scope="col">Categoría*</th>
                            <th scope="col">Fecha*</th>
                            <th scope="col">Lugar*</th>
                            <th scope="col">Dir</th>
                            <th scope="col">Insta</th>
                            <th scope="col">Web</th>
                            <th scope="col">Ticket</th>
                            <th scope="col" className="text-center">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {shows.map((show, index) => (
                            <tr key={index}>
                                <td style={{ verticalAlign: "middle" }}>{show.show_id}</td>
                                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                                    {show.image_url ? (
                                        <img
                                            src={show.image_url}
                                            alt="Flyer"
                                            width={50}
                                            style={{ maxHeight: 50, objectFit: "cover" }}
                                        />
                                    ) : (
                                        <span>Sin imagen</span>
                                    )}
                                </td>
                                <td style={{ verticalAlign: "middle" }}>{show.title}</td>
                                <td style={{ verticalAlign: "middle" }}>
                                    {Array.isArray(show.categories) && show.categories.length > 0 ? (
                                        <div className="d-flex align-items-center">
                                            <span title={show.categories.join(", ")}>
                                                {show.categories.join(", ").length > 15
                                                    ? `${show.categories.join(", ").slice(0, 15)}...`
                                                    : show.categories.join(", ")}
                                            </span>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                    {show.event_date &&
                                        format(new Date(show.event_date), "dd/MM/yyyy")}
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                    {show.venue && (
                                        <div className="d-flex align-items-center">
                                            <span title={show.venue}>
                                                {show.venue.length > 15
                                                    ? `${show.venue.slice(0, 15)}...`
                                                    : show.venue}
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                    {show.address && (
                                        <div className="d-flex align-items-center">
                                            <span title={show.address}>
                                                {show.address.length > 15
                                                    ? `${show.address.slice(0, 15)}...`
                                                    : show.address}
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                    {show.instagram && (
                                        <div className="d-flex align-items-center">
                                            <a
                                                href={`https://instagram.com/${show.instagram.replace('@', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FaInstagram className="me-2" />
                                            </a>
                                        </div>
                                    )}
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                    {show.web && (
                                        <div className="d-flex align-items-center">
                                            <a
                                                href={show.web.startsWith('http') ? show.web : `https://${show.web}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FaGlobe className="me-2" />
                                            </a>
                                        </div>
                                    )}
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                    {show.url && (
                                        <div className="d-flex align-items-center">
                                            <a
                                                href={show.url.startsWith('http') ? show.url : `https://${show.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FaCopy className="me-2" />
                                            </a>
                                        </div>
                                    )}
                                </td>
                                <td className="text-center align-content-center">
                                    <div className="d-flex justify-content-center">
                                        <span
                                            onClick={() => {
                                                setSelectedEvent(show);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="text-primary mx-2"
                                            style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                            title="Editar"
                                        >
                                            <FaEdit />
                                        </span>
                                        <span
                                            onClick={() => showDeleteConfirmation(show.show_id, show.title)}
                                            className="text-danger mx-2"
                                            style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                            title="Eliminar"
                                        >
                                            <FaTrash />
                                        </span>
                                    </div>
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

                <ModalCustom
                    showModal={isEditModalOpen}
                    toggleModal={() => setIsEditModalOpen(false)}
                    getShows={getShows}
                    selectedEvent={selectedEvent}
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
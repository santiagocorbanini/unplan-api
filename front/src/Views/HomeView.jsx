import { Container } from "react-bootstrap";
import Navbar from "../Components/Navbar/Navbar";
import TableShows from "../Components/Table/Table";
import { useEffect, useState } from "react";
import "./HomeView.scss";

const HomeView = () => {
    const [parsedUser, setParsedUser] = useState({});

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const parsedUser = JSON.parse(storedUser);
        setParsedUser(parsedUser);
    }, []);

    return (
        <Container fluid className="w-100 p-0 main-content">
            <Navbar usuario={parsedUser.email} />
            <h1 className="text-center text-black">Administrador</h1>
            <TableShows />
        </Container>
    );
};

export default HomeView;

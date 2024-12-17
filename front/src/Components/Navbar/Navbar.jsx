import { app } from "../../firebaseConfig/firebase";
import { getAuth, signOut } from "firebase/auth";
import { Button, Container, Row, Col } from "react-bootstrap";
import "./Navbar.scss";
import logo from "../../assets/unplan-logo.png";

const auth = getAuth(app);

const Navbar = ({ usuario }) => {
    return (
        <Container fluid className="navbar">
            <Row className="w-100">
                <Col lg={4} md={12} xs={12} className="col-1 d-flex">
                    <a href="https://trtproducciones.com/" target="_blank">
                        <img
                            width={56}
                            className="img-fluid p-2 mx-auto d-block"
                            src={logo}
                            role="img"
                            alt="UnPlanLogo"
                            aria-label="Ir al sitio Un Plan en Junín en una nueva ventana"
                        />
                    </a>
                </Col>
                <Col
                    lg={4}
                    xs={12}
                    md={12}
                    className="d-flex justify-content-around align-items-center col-2"
                >
                    <span className="text-white text-center mx-auto text-nav">
                        Bienvenido: {usuario}
                    </span>
                </Col>
                <Col
                    lg={4}
                    xs={12}
                    md={12}
                    className="d-flex justify-content-end align-items-center col-3"
                >
                    <Button className="button-custom m-0" onClick={() => signOut(auth)}>
                        Salir
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Navbar;

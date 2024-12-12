import { useState } from "react";
import { app } from "../../firebaseConfig/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Formik, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import "./Auth.scss";

const auth = getAuth(app);

const Auth = () => {
    const handleSubmit = async (values) => {
        const { email, password } = values;

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Credenciales inválidas.",
            });
        }
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Correo electrónico inválido")
            .required("Campo Requerido"),
        password: Yup.string().required("Campo requerido"),
    });

    return (
        <>
            <h1 className="text-center text-white mt-5">Login</h1>
            <Container className="main-container-login">
                <Row className="g-0 w-100">
                    <Col
                        className="login-left-side d-flex align-items-center justify-content-center"
                        lg={6}
                    >
                        <a href="https://trtproducciones.com/" target="_blank">
                            <img
                                width={350}
                                className="img-fluid p-2 mx-auto d-block"
                                src="./../../assets/unplan-logo.png"
                                role="img"
                                alt="UnPlanLogo"
                                aria-label="Ir al sitio Un Plan en Junín en una nueva ventana"
                            />
                        </a>
                    </Col>
                    <Col lg={6}>
                        <Card className="w-75">
                            <Card.Body>
                                <Formik
                                    initialValues={{ email: "", password: "" }}
                                    onSubmit={handleSubmit}
                                    validationSchema={validationSchema}
                                >
                                    {({ handleSubmit, handleChange, values }) => (
                                        <Form onSubmit={handleSubmit} className="form p-3">
                                            <Form.Group controlId="email">
                                                <Form.Label className="label text-white text-uppercase">
                                                    Correo electrónico:
                                                </Form.Label>
                                                <Field
                                                    id="email"
                                                    type="email"
                                                    placeholder="Ingresar correo electrónico"
                                                    value={values.email}
                                                    className="form-control mb-2"
                                                />
                                                <ErrorMessage
                                                    name="email"
                                                    component="div"
                                                    className="text-danger mb-2"
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="password">
                                                <Form.Label className="label text-white text-uppercase">
                                                    Contraseña:
                                                </Form.Label>
                                                <Field
                                                    id="password"
                                                    type="password"
                                                    placeholder="Ingresar contraseña"
                                                    value={values.password}
                                                    className="form-control mb-2"
                                                />
                                                <ErrorMessage
                                                    name="password"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </Form.Group>
                                            <div className="d-flex justify-content-center">
                                                <Button
                                                    type="submit"
                                                    className="button-custom btn-primary btn-block w-100"
                                                >
                                                    Iniciar Sesión
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Auth;

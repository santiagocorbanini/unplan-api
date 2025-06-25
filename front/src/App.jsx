import { useState, useEffect } from "react";
import HomeView from "./Views/HomeView";
import Auth from "./Components/Auth/Auth";
import { app } from "./firebaseConfig/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "./App.scss";

const auth = getAuth(app);

const App = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const API_URL = import.meta.env.VITE_APP_API_URL;

    const sendTokenToBackend = async (firebaseUser) => {
        try {
            console.log("🔐 Enviando token al backend...");
            const idToken = await firebaseUser.getIdToken();
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idToken }),
            });

            if (!response.ok) {
                const error = await response.text();
                console.error("Error en login backend:", error);
                return;
            }

            const data = await response.json();
            localStorage.setItem("accessToken", data.token);
        } catch (err) {
            console.error("Error enviando token a backend:", err);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userLogged) => {
            if (userLogged) {
                setUser(userLogged);
                localStorage.setItem("user", JSON.stringify(userLogged));

                // Solo enviar token si aún no está guardado
                const hasToken = localStorage.getItem("accessToken");
                if (!hasToken) {
                    await sendTokenToBackend(userLogged);
                }
            } else {
                setUser(null);
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
            }

            setIsLoading(false);
        });

        return () => unsubscribe(); // Cleanup
    }, []);

    return <div>{!isLoading && (user ? <HomeView /> : <Auth />)}</div>;
};

export default App;

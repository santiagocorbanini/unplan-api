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

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    onAuthStateChanged(auth, (userLogged) => {
        if (userLogged) {
            setUser(userLogged);
            localStorage.setItem("user", JSON.stringify(userLogged));
        } else {
            setUser(null);
            localStorage.removeItem("user");
        }
    });

    return <div>{!isLoading && (user ? <HomeView /> : <Auth />)}</div>;
};

export default App;

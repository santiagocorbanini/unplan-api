import { initializeApp } from "firebase/app"
import { getFirestore } from "@firebase/firestore"
/*
const firebaseConfig = {
    apiKey: "AIzaSyDSHj8Ka_m7QGlWNSXitHoroTnz_wKnN2Y",
    authDomain: "crud-2222agencia.firebaseapp.com",
    projectId: "crud-2222agencia",
    storageBucket: "crud-2222agencia.appspot.com",
    messagingSenderId: "464704355531",
    appId: "1:464704355531:web:0a5ca615c3ff2c4ec6af4e",
}
*/
const firebaseConfig = {
    apiKey: "AIzaSyCAYtI1P7cnF8uffI0kwPtWWeaoi7l_hQM",
    authDomain: "unplanenjunin-70d78.firebaseapp.com",
    projectId: "unplanenjunin-70d78",
    storageBucket: "unplanenjunin-70d78.firebasestorage.app",
    messagingSenderId: "300192793297",
    appId: "1:300192793297:web:61499aee7a08c744797bf0",
    measurementId: "G-TGJ8C9BC6R"
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

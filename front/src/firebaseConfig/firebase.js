import { initializeApp } from "firebase/app"
import { getFirestore } from "@firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDSHj8Ka_m7QGlWNSXitHoroTnz_wKnN2Y",
    authDomain: "crud-2222agencia.firebaseapp.com",
    projectId: "crud-2222agencia",
    storageBucket: "crud-2222agencia.appspot.com",
    messagingSenderId: "464704355531",
    appId: "1:464704355531:web:0a5ca615c3ff2c4ec6af4e",
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

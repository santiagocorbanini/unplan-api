import { Router } from "express";
import jwt from "jsonwebtoken";
import admin from "firebase-admin";
import serviceAccount from "../firebase/firebase-service-account.json" assert { type: "json" };

const router = Router();

// Inicializar Firebase Admin SDK si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

/**
 * POST /auth/login
 * Espera recibir un idToken de Firebase y responde con un JWT personalizado
 */
router.post("/login", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "Token de Firebase requerido" });
  }

  try {
    // Verificar el token de Firebase
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Generar un token JWT personalizado (tuyo)
    const customToken = jwt.sign(
      {
        uid: decoded.uid,
        email: decoded.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    res.json({ token: customToken });
  } catch (error) {
    console.error("Error verificando el token de Firebase:", error);
    res.status(401).json({ error: "Token inválido" });
  }
});

export default router;

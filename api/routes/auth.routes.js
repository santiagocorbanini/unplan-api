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
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Verifica el ID Token de Firebase y devuelve un token JWT del servidor
 *     tags: [Auth]
 *     description: >
 *       Este endpoint recibe un Firebase ID Token (obtenido desde el frontend luego de que el usuario se autentique con Firebase usando correo/contraseña).
 *       El servidor verifica ese token y, si es válido, genera un JWT propio que puede usarse para autenticación en rutas protegidas.
 *       
 *       ⚠️ **Primero el usuario debe loguearse con Firebase desde el frontend y obtener su ID token.**
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Token de Firebase Authentication
 *                 example: eyJhbGciOi...
 *     responses:
 *       200:
 *         description: Token JWT generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT para autenticación
 *       400:
 *         description: Token de Firebase no provisto
 *       401:
 *         description: Token inválido
 */

router.post("/login", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "Token de Firebase requerido" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

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

/**
 * @swagger
 * /auth/login-client:
 *   post:
 *     summary: Login con email y password, devuelve un JWT del servidor
 *     tags: [Auth]
 *     description: >
 *       Este endpoint recibe las credenciales de un usuario (email y password) y las envía a Firebase Authentication para verificar las credenciales.
 *       Si son válidas, genera un JWT propio del servidor.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: JWT generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT del servidor
 *                 firebaseIdToken:
 *                   type: string
 *                   description: ID Token de Firebase (opcional)
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno
 */

router.post("/login-client", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña requeridos" });
    }
  
    try {
      const firebaseRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );
  
      const data = await firebaseRes.json();
  
      if (!firebaseRes.ok) {
        return res.status(401).json({ error: data.error.message });
      }
  
      // ✅ Reutilizar la lógica de generación del token
      const customToken = await generateServerTokenFromFirebaseToken(data.idToken);
  
      res.json({
        token: customToken, // Token del servidor
        firebaseIdToken: data.idToken, // Por si lo necesitás en el frontend
      });
    } catch (err) {
      console.error("Error al loguear:", err);
      res.status(500).json({ error: "Error interno" });
    }
  });

  // Función auxiliar para generar tu token propio a partir de un Firebase ID token
async function generateServerTokenFromFirebaseToken(idToken) {
    const decoded = await admin.auth().verifyIdToken(idToken);
  
    const customToken = jwt.sign(
      {
        uid: decoded.uid,
        email: decoded.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );
  
    return customToken;
  }
  

export default router;

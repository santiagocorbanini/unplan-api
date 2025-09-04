import { Router } from "express";
import { infoController } from "../controllers/info.controllers.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Info
 *     description: Endpoints para gestionar la información de la ciudad
 */

/**
 * @swagger
 * /info:
 *   get:
 *     summary: Obtener la información de la ciudad
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: Información obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 como_llegar:
 *                   type: string
 *                   example: "Desde el aeropuerto se puede tomar un taxi o bus..."
 *                 numeros_utiles:
 *                   type: string
 *                   example: "Emergencias: 911, Hospital: 123456789"
 *                 atractivos:
 *                   type: string
 *                   example: "Museos, parques y monumentos históricos"
 *                 transporte:
 *                   type: string
 *                   example: "Colectivos, metro y taxis disponibles"
 */
router.get("/", infoController.getInfo);

/**
 * @swagger
 * /info:
 *   put:
 *     summary: Actualizar la información de la ciudad
 *     tags: [Info]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               como_llegar:
 *                 type: string
 *                 example: "Desde el aeropuerto se puede tomar un taxi o bus..."
 *               numeros_utiles:
 *                 type: string
 *                 example: "Emergencias: 911, Hospital: 123456789"
 *               atractivos:
 *                 type: string
 *                 example: "Museos, parques y monumentos históricos"
 *               transporte:
 *                 type: string
 *                 example: "Colectivos, metro y taxis disponibles"
 *     responses:
 *       200:
 *         description: Información actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 como_llegar:
 *                   type: string
 *                 numeros_utiles:
 *                   type: string
 *                 atractivos:
 *                   type: string
 *                 transporte:
 *                   type: string
 */
router.put("/", verifyToken, infoController.updateInfo);

export default router;

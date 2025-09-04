// routes/settings.routes.js
import { Router } from "express";
import { settingsController } from "../controllers/settings.controllers.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Settings
 *     description: Metadatos del sitio (title, description, email, instagram, telephone)
 */

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Obtener configuración del sitio
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Configuración actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: 
 *                   type: integer
 *                   example: 1
 *                 title: 
 *                   type: string
 *                   example: "Junín Turismo"
 *                 description: 
 *                   type: string
 *                   example: "Guía oficial de la ciudad"
 *                 email: 
 *                   type: string
 *                   example: "contacto@junin.tur"
 *                 instagram: 
 *                   type: string
 *                   example: "junin.oficial"
 *                 telephone:
 *                   type: string
 *                   example: "+54 236 123456"
 */
router.get("/", settingsController.getSettings);

/**
 * @swagger
 * /settings:
 *   put:
 *     summary: Actualizar parcial o totalmente los metadatos del sitio
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: 
 *                 type: string
 *                 example: "Junín Turismo"
 *               description: 
 *                 type: string
 *                 example: "Guía oficial de la ciudad"
 *               email: 
 *                 type: string
 *                 example: "contacto@junin.tur"
 *               instagram: 
 *                 type: string
 *                 example: "junin.oficial"
 *               telephone:
 *                 type: string
 *                 example: "+54 236 123456"
 *     responses:
 *       200:
 *         description: Configuración actualizada
 */
router.put("/", verifyToken, settingsController.updateSettings);

export default router;

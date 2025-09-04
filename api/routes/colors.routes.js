import { Router } from "express";
import { colorsController } from "../controllers/colors.controllers.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Colors
 *     description: Endpoints para configurar la paleta de colores del sitio
 */

/**
 * @swagger
 * /colors:
 *   get:
 *     summary: Obtener la paleta actual de colores
 *     tags: [Colors]
 *     responses:
 *       200:
 *         description: Paleta obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 general:
 *                   type: string
 *                   example: "#000000"
 *                 primary:
 *                   type: string
 *                   example: "#123sff"
 *                 background:
 *                   type: string
 *                   example: "#ffffff"
 */
router.get("/", colorsController.getColors);

/**
 * @swagger
 * /colors:
 *   put:
 *     summary: Actualizar parcial o totalmente la paleta de colores (registro único)
 *     tags: [Colors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               general:
 *                 type: string
 *                 description: Color general (hex)
 *                 example: "#000000"
 *               primary:
 *                 type: string
 *                 description: Color primario (hex)
 *                 example: "#123sff"
 *               background:
 *                 type: string
 *                 description: Color de fondo (hex)
 *                 example: "#f5f5f5"
 *     responses:
 *       200:
 *         description: Paleta actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 general:
 *                   type: string
 *                 primary:
 *                   type: string
 *                 background:
 *                   type: string
 */
router.put("/", verifyToken, colorsController.updateColors);

export default router;

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
 * components:
 *   schemas:
 *     Color:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         general:
 *           type: string
 *           description: Color general en formato HEX
 *           example: "#000000"
 *         primary:
 *           type: string
 *           description: Color primario en formato HEX
 *           example: "#123sff"
 *         background:
 *           type: string
 *           description: Color de fondo en formato HEX
 *           example: "#ffffff"
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
 *               $ref: '#/components/schemas/Color'
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
 *             $ref: '#/components/schemas/Color'
 *     responses:
 *       200:
 *         description: Paleta actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 */
router.put("/", verifyToken, colorsController.updateColors);

export default router;

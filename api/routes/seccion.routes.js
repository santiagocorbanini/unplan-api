import { Router } from "express";
import { seccionController } from "../controllers/seccion.controllers.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Secciones
 *     description: Endpoints para gestionar las secciones
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Seccion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *         seccion_padre:
 *           type: string
 *           enum: [salir, comer, dormir, actividades, comercios]
 *         seccion_order:
 *           type: integer
 */

/**
 * @swagger
 * /secciones:
 *   get:
 *     summary: Obtener todas las secciones
 *     tags: [Secciones]
 *     responses:
 *       200:
 *         description: Lista de secciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Seccion'
 */
router.get("/", seccionController.getAll);

/**
 * @swagger
 * /secciones/{id}:
 *   get:
 *     summary: Obtener una sección por ID
 *     tags: [Secciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sección encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seccion'
 *       404:
 *         description: Sección no encontrada
 */
router.get("/:id", seccionController.getById);

/**
 * @swagger
 * /secciones:
 *   post:
 *     summary: Crear una nueva sección
 *     tags: [Secciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Seccion'
 *     responses:
 *       201:
 *         description: Sección creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seccion'
 */
router.post("/", verifyToken, seccionController.create);

/**
 * @swagger
 * /secciones/{id}:
 *   put:
 *     summary: Actualizar una sección
 *     tags: [Secciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Seccion'
 *     responses:
 *       200:
 *         description: Sección actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seccion'
 *       404:
 *         description: Sección no encontrada
 */
router.put("/:id", verifyToken, seccionController.update);

/**
 * @swagger
 * /secciones/{id}:
 *   delete:
 *     summary: Eliminar una sección por ID
 *     tags: [Secciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sección eliminada
 *       404:
 *         description: Sección no encontrada
 */
router.delete("/:id", verifyToken, seccionController.remove);

/**
 * @swagger
 * /secciones/padre/{seccion_padre}:
 *   get:
 *     summary: Obtener secciones por tipo de seccion_padre
 *     tags: [Secciones]
 *     parameters:
 *       - in: path
 *         name: seccion_padre
 *         required: true
 *         schema:
 *           type: string
 *           enum: [salir, comer, dormir, actividades, comercios]
 *     responses:
 *       200:
 *         description: Lista de secciones filtradas por seccion_padre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Seccion'
 *       400:
 *         description: Valor de seccion_padre no válido
 */
router.get("/padre/:seccion_padre", seccionController.getByPadre);

export default router;

// routes/generals.routes.js
import { Router } from "express";
import { generalsController } from "../controllers/generals.controllers.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Generals
 *     description: Configuración general del sitio (colores + branding + settings)
 */

/**
 * @swagger
 * /generals:
 *   get:
 *     summary: Obtener configuración general (colores, branding e información del sitio)
 *     tags: [Generals]
 *     responses:
 *       200:
 *         description: Configuración general actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 general:
 *                   type: string
 *                   example: "#000000"
 *                 primary:
 *                   type: string
 *                   example: "#123sff"
 *                 background:
 *                   type: string
 *                   example: "#ffffff"
 *                 logo:
 *                   type: string
 *                   example: "http://localhost:5000/uploads/logo-1712345678.png"
 *                 banner:
 *                   type: string
 *                   example: "http://localhost:5000/uploads/banner-1712345679.jpg"
 *                 icon:
 *                   type: string
 *                   example: "http://localhost:5000/uploads/icon-1712345680.png"
 *                 title:
 *                   type: string
 *                   example: "Junín Turismo"
 *                 description:
 *                   type: string
 *                   example: "Guía oficial de la ciudad"
 *                 email:
 *                   type: string
 *                   example: "contacto@junin.tur"
 *                 telephone:
 *                   type: string
 *                   example: "+54 236 123456"
 *                 instagram:
 *                   type: string
 *                   example: "junin.oficial"
 */
router.get("/", generalsController.getGenerals);

export default router;

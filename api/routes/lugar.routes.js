import { Router } from "express";
import { lugarController } from "../controllers/lugar.controllers.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

const uploadDir = path.resolve("public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const uniqueName = `logo-${Date.now()}.${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Solo se permiten imágenes"), false);
  },
});

/**
 * @swagger
 * tags:
 *   - name: Lugares
 *     description: Endpoints para gestionar los lugares
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Lugar:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 42
 *         nombre:
 *           type: string
 *           example: "Pizzería Napoli"
 *         direccion:
 *           type: string
 *           example: "Av. Siempre Viva 742"
 *         link_direccion:
 *           type: string
 *           example: "https://maps.google.com/?q=..."
 *         telefono:
 *           type: string
 *           example: "+54 11 5555-5555"
 *         logo_url:
 *           type: string
 *           example: "http://localhost:5047/uploads/logo-1712345678901.png"
 *         descripcion:
 *           type: string
 *           example: "La mejor pizza a la piedra."
 *         reservas:
 *           type: string
 *           example: "https://reservo.com/napoli"
 *         menu:
 *           type: string
 *           example: "https://napoli.com/menu.pdf"
 *         delivery:
 *           type: string
 *           example: "https://pedidos.com/napoli"
 *         web:
 *           type: string
 *           example: "https://napoli.com"
 *         is_featured:
 *           type: boolean
 *           example: true
 *         instagram:
 *           type: string
 *           example: "https://instagram.com/napoli"
 *         youtube:
 *           type: string
 *           example: "https://youtube.com/@napoli"
 *         seccion_id:
 *           type: integer
 *           example: 3
 *         lugares_order:
 *           type: integer
 *           example: 2
 *         seccion_nombre:
 *           type: string
 *           description: Nombre de la sección (join)
 *           example: "Pizzerías"
 *     LugarCreateUpdate:
 *       type: object
 *       properties:
 *         logo:
 *           type: string
 *           format: binary
 *           description: Archivo de imagen para el logo
 *         nombre:
 *           type: string
 *         direccion:
 *           type: string
 *         link_direccion:
 *           type: string
 *         telefono:
 *           type: string
 *         descripcion:
 *           type: string
 *         reservas:
 *           type: string
 *         menu:
 *           type: string
 *         delivery:
 *           type: string
 *         web:
 *           type: string
 *         instagram:
 *           type: string
 *         youtube:
 *           type: string
 *         seccion_id:
 *           type: integer
 *         is_featured:
 *           type: boolean
 *         lugares_order:
 *           type: integer
 */

/**
 * @swagger
 * /lugares:
 *   get:
 *     summary: Obtener todos los lugares
 *     tags: [Lugares]
 *     responses:
 *       200:
 *         description: Lista de lugares
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lugar'
 */
router.get("/", lugarController.getAll);

/**
 * @swagger
 * /lugares/{lugar_id}:
 *   get:
 *     summary: Obtener un lugar por ID
 *     tags: [Lugares]
 *     parameters:
 *       - in: path
 *         name: lugar_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lugar encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lugar'
 *       404:
 *         description: Lugar no encontrado
 */
router.get("/:lugar_id", lugarController.getLugarById);

/**
 * @swagger
 * /lugares:
 *   post:
 *     summary: Crear un lugar con logo
 *     tags: [Lugares]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/LugarCreateUpdate'
 *     responses:
 *       200:
 *         description: Lugar creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lugar'
 */
router.post(
  "/",
  verifyToken,
  upload.single("logo"),
  async (req, res, next) => {
    try {
      if (req.file) {
        const originalPath = path.join(uploadDir, req.file.filename);
        const tempPath = path.join(uploadDir, `temp-${req.file.filename}`);
        await sharp(originalPath).jpeg({ quality: 70 }).png({ quality: 70 }).toFile(tempPath);
        fs.unlinkSync(originalPath);
        fs.renameSync(tempPath, originalPath);
        console.log(`Imagen ${req.file.filename} comprimida correctamente`);
      }
      next();
    } catch (error) {
      console.error("Error comprimiendo imagen:", error);
      // cuidado: tempPath solo existe si hubo file
      try {
        if (req.file) {
          const tempPath = path.join(uploadDir, `temp-${req.file.filename}`);
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
      } catch {}
      next(error);
    }
  },
  lugarController.createLugar
);

/**
 * @swagger
 * /lugares/{lugar_id}:
 *   put:
 *     summary: Actualizar un lugar
 *     tags: [Lugares]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lugar_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/LugarCreateUpdate'
 *     responses:
 *       200:
 *         description: Lugar actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lugar'
 */
router.put(
  "/:lugar_id",
  verifyToken,
  upload.single("logo"),
  async (req, res, next) => {
    const originalPath = req.file ? path.join(uploadDir, req.file.filename) : null;
    const tempPath = req.file ? path.join(uploadDir, `temp-${req.file.filename}`) : null;

    try {
      if (req.file) {
        await sharp(originalPath).jpeg({ quality: 70 }).png({ quality: 70 }).toFile(tempPath);
        fs.unlinkSync(originalPath);
        fs.renameSync(tempPath, originalPath);
        console.log(`Imagen ${req.file.filename} comprimida correctamente`);
      }
      next();
    } catch (error) {
      console.error("Error comprimiendo imagen:", error);
      if (tempPath && fs.existsSync(tempPath)) {
        try { fs.unlinkSync(tempPath); } catch {}
      }
      next(error);
    }
  },
  lugarController.updateLugar
);

/**
 * @swagger
 * /lugares/{lugar_id}:
 *   delete:
 *     summary: Eliminar un lugar por ID
 *     tags: [Lugares]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lugar_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lugar eliminado
 *       404:
 *         description: Lugar no encontrado
 */
router.delete("/:lugar_id", verifyToken, lugarController.deleteLugar);

/**
 * @swagger
 * /lugares/by-seccion-padre/{seccion_padre}:
 *   get:
 *     summary: Obtener lugares filtrados por sección padre
 *     tags: [Lugares]
 *     parameters:
 *       - in: path
 *         name: seccion_padre
 *         required: true
 *         schema:
 *           type: string
 *           enum: [salir, comer, dormir, actividades, comercios]
 *         description: Nombre de la sección padre
 *     responses:
 *       200:
 *         description: Lista de lugares de esa sección padre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lugar'
 */
router.get("/by-seccion-padre/:seccion_padre", lugarController.getBySeccionPadre);

/**
 * @swagger
 * /lugares/by-seccion-padre/{seccion_padre}/seccion_nombre/{seccion_nombre}:
 *   get:
 *     summary: Obtener lugares por sección padre y nombre de sub-sección
 *     tags: [Lugares]
 *     parameters:
 *       - in: path
 *         name: seccion_padre
 *         required: true
 *         schema:
 *           type: string
 *           enum: [salir, comer, dormir, actividades, comercios]
 *       - in: path
 *         name: seccion_nombre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de lugares filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lugar'
 */
router.get(
  "/by-seccion-padre/:seccion_padre/seccion_nombre/:seccion_nombre",
  lugarController.getBySeccionPadreAndNombre
);

export default router;

import { Router } from "express";
import { showController } from "../controllers/show.controllers.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import sharp from 'sharp';
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

// Configuración del almacenamiento de archivos
const uploadDir = path.resolve("public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.split('.').pop();
      const uniqueName = `flyer-${Date.now()}.${ext}`;
      cb(null, uniqueName);
    },
  });

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten imágenes'), false);
      }
    }
  });

/**
 * @swagger
 * tags:
 *   - name: Shows
 *     description: Endpoints para gestionar los shows
 */

/**
 * @swagger
 * /shows:
 *   get:
 *     summary: Obtener todos los shows
 *     tags: [Shows]
 *     responses:
 *       200:
 *         description: Lista de shows
 */
router.get("/", showController.getAll);

/**
 * @swagger
 * /shows/actualShows:
 *   get:
 *     summary: Obtener shows activos con filtros opcionales
 *     tags: [Shows]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: Lista separada por coma de categorías
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           example: "18/07/2025"
 *     responses:
 *       200:
 *         description: Lista paginada de shows filtrados
 */
router.get("/actualShows", showController.getActualShows);

/**
 * @swagger
 * /shows/listShowsMain:
 *   get:
 *     summary: Obtener URLs de todos los shows
 *     tags: [Shows]
 *     responses:
 *       200:
 *         description: Lista de URLs
 */
router.get("/listShowsMain", showController.getListShowsMain);

/**
 * @swagger
 * /shows/listShowsProximos:
 *   get:
 *     summary: Obtener lista de próximos shows (titulo, lugar, ciudad, etc.)
 *     tags: [Shows]
 *     responses:
 *       200:
 *         description: Lista de próximos shows
 */
router.get("/listShowsProximos", showController.getListShowsProximos);

/**
 * @swagger
 * /shows/show/{show_id}:
 *   get:
 *     summary: Obtener un show por ID
 *     tags: [Shows]
 *     parameters:
 *       - in: path
 *         name: show_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Show encontrado
 *       404:
 *         description: Show no encontrado
 */
router.get("/show/:show_id", showController.getShowById);

/**
 * @swagger
 * /shows/search:
 *   post:
 *     summary: Buscar shows por título
 *     tags: [Shows]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               page:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Resultados de la búsqueda
 */
router.post("/search", showController.searchShows);

/**
 * @swagger
 * /shows:
 *   post:
 *     summary: Crear un show con imagen
 *     tags: [Shows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               flyer:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               event_date:
 *                 type: string
 *                 example: yyyy-mm-dd
 *               city:
 *                 type: string
 *               venue:
 *                 type: string
 *                 example: 'City Rock'
 *               url:
 *                 type: string
 *               completedevent:
 *                 type: boolean
 *               categories:
 *                 type: string
 *                 example: '["rock", "pop1"]'
 *               instagram:
 *                 type: string
 *               web:
 *                 type: string
 *               address:
 *                 type: string
 *               is_featured:
 *                 type: boolean
 *                 default: false
 *               youtube:
 *                 type: string
 *                 example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
 *               description:
 *                 type: string
 *                 example: 'Un evento imperdible con bandas de rock en vivo.'
 *     responses:
 *       200:
 *         description: Show creado exitosamente
 */
router.post("/", verifyToken, upload.single("flyer"), async (req, res, next) => {
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
    console.error('Error comprimiendo imagen:', error);
    if (req.file && fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    next(error);
  }
}, showController.createShow);

/**
 * @swagger
 * /shows/updateShow/{show_id}:
 *   put:
 *     summary: Actualizar un show
 *     tags: [Shows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: show_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               flyer:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               event_date:
 *                 type: string
 *               city:
 *                 type: string
 *               venue:
 *                 type: string
 *                 example: 'City Rock'
 *               url:
 *                 type: string
 *               completedevent:
 *                 type: boolean
 *               categories:
 *                 type: string
 *                 example: '["rock", "pop"]'
 *               instagram:
 *                 type: string
 *               web:
 *                 type: string
 *               address:
 *                 type: string
 *               is_featured:
 *                 type: boolean
 *                 default: false
 *               youtube:
 *                 type: string
 *                 example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
 *               description:
 *                 type: string
 *                 example: 'Un evento actualizado con artistas invitados.'
 *     responses:
 *       200:
 *         description: Show actualizado
 */
router.put("/updateShow/:show_id", verifyToken, upload.single("flyer"), async (req, res, next) => {
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
    console.error('Error comprimiendo imagen:', error);
    if (tempPath && fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    next(error);
  }
}, showController.updateShow);

/**
 * @swagger
 * /shows/deleteShow/{show_id}:
 *   delete:
 *     summary: Eliminar un show por ID
 *     tags: [Shows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: show_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Show eliminado
 *       404:
 *         description: Show no encontrado
 */
router.delete("/deleteShow/:show_id", verifyToken, showController.deleteShow);

/**
 * @swagger
 * /shows/featured:
 *   get:
 *     summary: Obtener shows destacados con paginación
 *     tags: [Shows]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         default: 15
 *     responses:
 *       200:
 *         description: Lista paginada de shows destacados
 */
router.get("/featured", showController.getFeaturedShows);

/**
 * @swagger
 * /shows/delete-past:
 *   delete:
 *     summary: Eliminar todos los shows anteriores a la fecha actual
 *     tags: [Shows]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shows eliminados correctamente
 *       500:
 *         description: Error al eliminar los shows
 */
router.delete("/delete-past", verifyToken, showController.deletePastShows);

export default router;

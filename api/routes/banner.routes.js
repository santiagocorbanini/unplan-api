import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { bannerController } from "../controllers/banner.controllers.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

// Carpeta
const bannersDir = path.resolve("public/uploads/banners");
if (!fs.existsSync(bannersDir)) {
  fs.mkdirSync(bannersDir, { recursive: true });
}

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, bannersDir),
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    const unique = `banner-${Date.now()}.${ext}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    return cb(new Error("Solo se permiten imágenes"), false);
  },
});

/**
 * @swagger
 * tags:
 *   - name: Banners
 *     description: Endpoints para gestionar los banners
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Banner:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         image_url: { type: string, example: "http://localhost:5000/uploads/banners/banner-1712345678901.png" }
 *         banner_name: { type: string, example: "Promo Primavera" }
 *         banner_url: { type: string, nullable: true, example: "https://mi-sitio.com/promo" }
 *         banner_order: { type: integer, example: 1 }
 *         available: { type: boolean, example: true }
 *         created_at: { type: string, format: date-time }
 *         updated_at: { type: string, format: date-time }
 *     PaginatedBannersResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Banner'
 *         total: { type: integer, example: 123 }
 *         totalPages: { type: integer, example: 9 }
 *         page: { type: integer, example: 2 }
 *         pageSize: { type: integer, example: 15 }
 *     BannerCreateUpdate:
 *       type: object
 *       properties:
 *         image:
 *           type: string
 *           format: binary
 *           description: Archivo de imagen del banner
 *         banner_name:
 *           type: string
 *           description: Nombre del banner (obligatorio en creación)
 *           example: "Promo Primavera"
 *         banner_url:
 *           type: string
 *           nullable: true
 *           description: URL opcional a donde apunta el banner
 *           example: "https://mi-sitio.com/promo"
 *         banner_order: { type: integer, example: 2 }
 *         available: { type: boolean, example: false }
 */

/**
 * @swagger
 * /banners:
 *   get:
 *     summary: Obtener banners con paginación y filtro
 *     tags: [Banners]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 15 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Buscar por nombre o URL del banner (case-insensitive)
 *       - in: query
 *         name: available
 *         schema: { type: boolean }
 *         description: Filtrar por disponibilidad (true/false)
 *     responses:
 *       200:
 *         description: Lista paginada de banners
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedBannersResponse'
 */
router.get("/", bannerController.getAll);

/**
 * @swagger
 * /banners/available:
 *   get:
 *     summary: Obtener banners disponibles (available = true) con paginación
 *     tags: [Banners]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 15 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Buscar por nombre o URL (case-insensitive)
 *     responses:
 *       200:
 *         description: Lista paginada de banners activos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedBannersResponse'
 */
router.get("/available", bannerController.getAvailable);

/**
 * @swagger
 * /banners/search:
 *   get:
 *     summary: Buscar banners por nombre/URL con paginación
 *     tags: [Banners]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Término de búsqueda (case-insensitive)
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 15 }
 *       - in: query
 *         name: available
 *         schema: { type: boolean }
 *         description: Filtrar por disponibilidad
 *     responses:
 *       200:
 *         description: Resultados paginados de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedBannersResponse'
 */
router.get("/search", bannerController.searchBanners);

/**
 * @swagger
 * /banners/{banner_id}:
 *   get:
 *     summary: Obtener un banner por ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: banner_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Banner encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 *       404:
 *         description: Banner no encontrado
 */
router.get("/:banner_id", bannerController.getById);

/**
 * @swagger
 * /banners:
 *   post:
 *     summary: Crear un banner con imagen
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/BannerCreateUpdate'
 *     responses:
 *       200:
 *         description: Banner creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 */
router.post(
  "/",
  verifyToken,
  upload.single("image"),
  async (req, res, next) => {
    const originalPath = req.file ? path.join(bannersDir, req.file.filename) : null;
    const tempPath = req.file ? path.join(bannersDir, `temp-${req.file.filename}`) : null;
    try {
      if (req.file) {
        await sharp(originalPath)
          .jpeg({ quality: 70 })
          .png({ quality: 70 })
          .toFile(tempPath);
        fs.unlinkSync(originalPath);
        fs.renameSync(tempPath, originalPath);
        console.log(`Banner ${req.file.filename} comprimido correctamente`);
      }
      next();
    } catch (error) {
      console.error("Error comprimiendo imagen de banner:", error);
      if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      next(error);
    }
  },
  bannerController.createBanner
);

/**
 * @swagger
 * /banners/{banner_id}:
 *   put:
 *     summary: Actualizar un banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: banner_id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/BannerCreateUpdate'
 *     responses:
 *       200:
 *         description: Banner actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 *       404:
 *         description: Banner no encontrado
 */
router.put(
  "/:banner_id",
  verifyToken,
  upload.single("image"),
  async (req, res, next) => {
    const originalPath = req.file ? path.join(bannersDir, req.file.filename) : null;
    const tempPath = req.file ? path.join(bannersDir, `temp-${req.file.filename}`) : null;
    try {
      if (req.file) {
        await sharp(originalPath)
          .jpeg({ quality: 70 })
          .png({ quality: 70 })
          .toFile(tempPath);
        fs.unlinkSync(originalPath);
        fs.renameSync(tempPath, originalPath);
        console.log(`Banner ${req.file?.filename} comprimido correctamente`);
      }
      next();
    } catch (error) {
      console.error("Error comprimiendo imagen de banner:", error);
      if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      next(error);
    }
  },
  bannerController.updateBanner
);

/**
 * @swagger
 * /banners/{banner_id}:
 *   delete:
 *     summary: Eliminar un banner por ID
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: banner_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Banner eliminado
 *       404:
 *         description: Banner no encontrado
 */
router.delete("/:banner_id", verifyToken, bannerController.deleteBanner);

export default router;

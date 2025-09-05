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
 * /banners/available:
 *   get:
 *     summary: Obtener todos los banners disponibles (available = true)
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: Lista de banners activos
 */
router.get("/available", bannerController.getAvailable);

/**
 * @swagger
 * /banners:
 *   get:
 *     summary: Obtener todos los banners
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: Lista de banners
 */
router.get("/", bannerController.getAll);

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
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Banner encontrado
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
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               banner_order:
 *                 type: integer
 *                 example: 1
 *               available:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Banner creado exitosamente
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
        await sharp(originalPath).jpeg({ quality: 70 }).png({ quality: 70 }).toFile(tempPath);
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
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               banner_order:
 *                 type: integer
 *                 example: 2
 *               available:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Banner actualizado
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
        await sharp(originalPath).jpeg({ quality: 70 }).png({ quality: 70 }).toFile(tempPath);
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
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Banner eliminado
 *       404:
 *         description: Banner no encontrado
 */
router.delete("/:banner_id", verifyToken, bannerController.deleteBanner);

export default router;

// routes/branding.routes.js
import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { verifyToken } from "../middlewares/auth.js";
import { brandingController } from "../controllers/branding.controllers.js";

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
    // base = logo | banner | icon (según el fieldname)
    let base = "asset";
    if (file.fieldname === "logo") base = "logo";
    else if (file.fieldname === "banner") base = "banner";
    else if (file.fieldname === "icon") base = "icon";
    const uniqueName = `${base}-${Date.now()}.${ext}`;
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
 *   - name: Branding
 *     description: Logo, banner e icono del sitio
 */

/**
 * @swagger
 * /branding:
 *   get:
 *     summary: Obtener logo, banner e icon actuales
 *     tags: [Branding]
 *     responses:
 *       200:
 *         description: Branding actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 logo_url:
 *                   type: string
 *                   example: "http://localhost:5000/uploads/logo-1712345678901.png"
 *                 banner_url:
 *                   type: string
 *                   example: "http://localhost:5000/uploads/banner-1712345678902.jpg"
 *                 icon_url:
 *                   type: string
 *                   example: "http://localhost:5000/uploads/icon-1712345678903.png"
 */
router.get("/", brandingController.getBranding);

/**
 * @swagger
 * /branding:
 *   put:
 *     summary: Actualizar parcial o totalmente logo, banner y/o icon
 *     tags: [Branding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *               banner:
 *                 type: string
 *                 format: binary
 *               icon:
 *                 type: string
 *                 format: binary
 *               logo_url:
 *                 type: string
 *                 description: Alternativa si ya tenés la URL (sin subir archivo)
 *                 example: "https://storage.googleapis.com/bucket/logo.png"
 *               banner_url:
 *                 type: string
 *                 description: Alternativa si ya tenés la URL (sin subir archivo)
 *                 example: "https://storage.googleapis.com/bucket/banner.jpg"
 *               icon_url:
 *                 type: string
 *                 description: Alternativa si ya tenés la URL (sin subir archivo)
 *                 example: "https://storage.googleapis.com/bucket/icon.png"
 *     responses:
 *       200:
 *         description: Branding actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 logo_url:
 *                   type: string
 *                 banner_url:
 *                   type: string
 *                 icon_url:
 *                   type: string
 */
router.put(
  "/",
  verifyToken,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  async (req, res, next) => {
    // Comprimir lo que haya llegado
    try {
      const files = [];
      if (req.files?.logo?.[0]) files.push(req.files.logo[0]);
      if (req.files?.banner?.[0]) files.push(req.files.banner[0]);
      if (req.files?.icon?.[0]) files.push(req.files.icon[0]);

      for (const f of files) {
        const originalPath = path.join(uploadDir, f.filename);
        const tempPath = path.join(uploadDir, `temp-${f.filename}`);
        await sharp(originalPath)
          .jpeg({ quality: 70 })
          .png({ quality: 70 })
          .toFile(tempPath);
        fs.unlinkSync(originalPath);
        fs.renameSync(tempPath, originalPath);
        console.log(`Imagen ${f.filename} comprimida correctamente`);
      }
      next();
    } catch (error) {
      console.error("Error comprimiendo imagen:", error);
      // limpiar archivos temporales si quedaron
      try {
        const files = [];
        if (req.files?.logo?.[0]) files.push(req.files.logo[0]);
        if (req.files?.banner?.[0]) files.push(req.files.banner[0]);
        if (req.files?.icon?.[0]) files.push(req.files.icon[0]);
        for (const f of files) {
          const tempPath = path.join(uploadDir, `temp-${f.filename}`);
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
      } catch {}
      next(error);
    }
  },
  brandingController.updateBranding
);

export default router;

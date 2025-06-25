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

router.get("/", showController.getAll);
router.get("/actualShows", showController.getActualShows);
router.get("/listShowsMain", showController.getListShowsMain);
router.get("/listShowsProximos", showController.getListShowsProximos);
router.get("/show/:show_id", showController.getShowById);
router.post("/search", showController.searchShows);

// Ruta para crear show con imagen
router.post("/", verifyToken, upload.single("flyer"), async (req, res, next) => {
    try {
      if (req.file) {
        const originalPath = path.join(uploadDir, req.file.filename);
        const tempPath = path.join(uploadDir, `temp-${req.file.filename}`);
        
        // 1. Comprimir a archivo temporal
        await sharp(originalPath)
          .jpeg({ quality: 70 })
          .png({ quality: 70 })
          .toFile(tempPath);
        
        // 2. Eliminar el original
        fs.unlinkSync(originalPath);
        
        // 3. Renombrar el temporal al nombre original
        fs.renameSync(tempPath, originalPath);
        
        console.log(`Imagen ${req.file.filename} comprimida correctamente`);
      }
      next();
    } catch (error) {
      console.error('Error comprimiendo imagen:', error);
      // Limpieza en caso de error
      if (req.file && fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      next(error);
    }
  }, showController.createShow);

// Ruta para actualizar show con imagen
router.put("/updateShow/:show_id", verifyToken, upload.single("flyer"), async (req, res, next) => {
    const originalPath = req.file ? path.join(uploadDir, req.file.filename) : null;
    const tempPath = req.file ? path.join(uploadDir, `temp-${req.file.filename}`) : null;
  
    try {
      if (req.file) {
        await sharp(originalPath)
          .jpeg({ quality: 70 })
          .png({ quality: 70 })
          .toFile(tempPath);
  
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

// Eliminar show
router.delete("/deleteShow/:show_id", verifyToken, showController.deleteShow);

export default router;

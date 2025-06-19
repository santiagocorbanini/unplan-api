import { Router } from "express";
import { showController } from "../controllers/show.controllers.js";
import multer from "multer";
import fs from "fs";
import path from "path";

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
    const ext = file.originalname.split(".").pop();
    const uniqueName = `flyer-${Date.now()}.${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.get("/", showController.getAll);
router.get("/actualShows", showController.getActualShows);
router.get("/listShowsMain", showController.getListShowsMain);
router.get("/listShowsProximos", showController.getListShowsProximos);
router.get("/show/:show_id", showController.getShowById);
router.post("/search", showController.searchShows);

// Ruta para crear show con imagen
router.post("/", upload.single("flyer"), showController.createShow);

// Ruta para actualizar show con imagen
router.put("/updateShow/:show_id", upload.single("flyer"), showController.updateShow);

// Eliminar show
router.delete("/deleteShow/:show_id", showController.deleteShow);

export default router;

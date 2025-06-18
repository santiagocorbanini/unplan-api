import { Router } from "express";
import { showController } from "../controllers/show.controllers.js";
// Importar multer y otras dependencias necesarias
import multer from "multer";

// Configurar multer para guardar las imágenes en el sistema de archivos
const storage = multer.memoryStorage(); // Puedes ajustar esto según tus necesidades
const upload = multer({ storage: storage });

const router = Router();

router.get("/", showController.getAll);
router.get("/actualShows", showController.getActualShows);
router.post("/", upload.single("flyer"), showController.createShow); // Use multer middleware for image upload
router.get("/listShowsMain", showController.getListShowsMain);
router.get("/listShowsProximos", showController.getListShowsProximos);
router.delete("/deleteShow/:show_id", showController.deleteShow);
router.put("/updateShow/:show_id", showController.updateShow);
router.get("/show/:show_id", showController.getShowById);
router.put("/updateShow/:show_id", upload.single("flyer"), async (req, res) => {
  try {
    const { show_id } = req.params;
    const newData = req.body;
    // Si se proporciona una nueva flyer, adjúntala a newData
    if (req.file) {
      newData.flyer = req.file.buffer.toString("base64"); // Convierte el buffer a una cadena base64
      // O guarda el buffer directamente dependiendo de tus necesidades
      // newData.flyer = req.file.buffer;
    }

    const response = await showController.updateShow(show_id, newData);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el espectáculo" });
  }
});
router.post("/search", showController.searchShows);

export default router;

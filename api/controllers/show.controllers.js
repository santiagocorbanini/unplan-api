import { showModel } from "../models/show.model.js";

const getAll = async (_, res) => {
  try {
    const response = await showModel.findAll();
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const getActualShows = async (_, res) => {
  try {
    const response = await showModel.findActualShows();
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

//Todos los shows con propiedas de Main (url, flyer)
const getListShowsMain = async (_, res) => {
  try {
    const response = await showModel.findListShowsMain();
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

//Todos los shows con propiedas de Proximos (titulo, lugar, ciudad, url, flyerHorizontal)
const getListShowsProximos = async (_, res) => {
  try {
    const response = await showModel.findListShowsProximos();
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const createShow = async (req, res) => {
  try {
    const body = req.body;
    const flyer = req.file; // Access the uploaded file using req.file

    // Check if an image was provided
    if (flyer) {
      body.flyer = flyer.buffer; // Update this based on your database model
    }

    const response = await showModel.createShow(body);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear el espectáculo" });
  }
};

const deleteShow = async (req, res) => {
  try {
    const { show_id } = req.params;
    const response = await showModel.deleteShow(show_id);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar el espectáculo" });
  }
};

const updateShow = async (req, res) => {
  try {
    const { show_id } = req.params;
    const newData = req.body;

    // Comprobar si hay un nuevo flyer en formato base64
    if (
      newData.flyer &&
      typeof newData.flyer === "string" &&
      newData.flyer.startsWith("data:image")
    ) {
      // Decodificar la cadena base64 y almacenarla como un buffer
      const flyerBuffer = Buffer.from(newData.flyer.split(",")[1], "base64");
      newData.flyer = flyerBuffer;
    }

    const response = await showModel.updateShow(show_id, newData);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el espectáculo" });
  }
};

const getShowById = async (req, res) => {
  try {
    const { show_id } = req.params;
    const response = await showModel.getShowById(show_id);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al buscar el show" });
  }
};
const uploadImage = async (req, res) => {
  try {
    const imageBuffer = req.file.buffer; // Obtén los datos binarios de la imagen
    // Llama a la función en tu modelo para guardar la imagen en la base de datos
    // Puedes adaptar esto según tu lógica específica
    const response = await showModel.saveImage(imageBuffer);
    res.json(response);
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    res.status(500).json({ error: "Error al subir la imagen" });
  }
};

export const showController = {
  getAll,
  getActualShows,
  createShow,
  getListShowsMain,
  getListShowsProximos,
  deleteShow,
  updateShow,
  getShowById,
  uploadImage,
};

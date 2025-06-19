import { showModel } from "../models/show.model.js";

const getAll = async (_, res) => {
  try {
    const response = await showModel.findAll();
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const getActualShows = async (req, res) => {
    try {
      const { page = 1, pageSize = 15, categorias, search } = req.query;
  
      const parsedPage = parseInt(page) || 1;
      const parsedPageSize = parseInt(pageSize) || 15;
  
      const categoriesArray = categorias ? categorias.split(',') : [];
      const searchText = search ? search.toLowerCase() : null;
  
      const response = await showModel.findActualShows(parsedPage, parsedPageSize, categoriesArray, searchText);
      res.json(response);
    } catch (error) {
      console.error("Error al obtener shows actuales filtrados:", error);
      res.status(500).json({ error: "Error al obtener shows actuales" });
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
      const flyer = req.file;
  
      if (flyer) {
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${flyer.filename}`;
        body.image_url = imageUrl;
      }
  
      const response = await showModel.createShow(body);
      res.json(response);
    } catch (error) {
      console.error("Error al crear el espectáculo:", error);
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
      let newData = req.body;
  
      // Manejar categories si viene como string CSV (porque multer no parsea arrays automáticamente)
      if (newData.categories && typeof newData.categories === "string") {
        newData.categories = newData.categories.split(",").map(cat => cat.trim());
      }
  
      // Si hay un archivo nuevo de flyer, agregamos la URL construida para la respuesta
      if (req.file) {
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        newData.image_url = imageUrl;
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

const searchShows = async (req, res) => {
    try {
      const { title, page } = req.body;
  
      if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Debe proporcionar un título para buscar." });
      }
  
      const results = await showModel.searchShowsByTitle(title, page);
      res.json(results);
    } catch (error) {
      console.error("Error al buscar shows:", error);
      res.status(500).json({ error: "Error al buscar los espectáculos." });
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
  searchShows
};

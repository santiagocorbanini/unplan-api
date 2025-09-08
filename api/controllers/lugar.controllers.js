import fs from "fs";
import path from "path";
import { lugarModel } from "../models/lugar.model.js";

const getAll = async (req, res) => {
    try {
      const response = await lugarModel.findAll();
      res.json(response);
    } catch (error) {
      console.error("Error al obtener lugares:", error);
      res.status(500).json({ error: "Error al obtener lugares" });
    }
  };

const getLugarById = async (req, res) => {
  try {
    const { lugar_id } = req.params;
    const response = await lugarModel.getLugarById(lugar_id);
    res.json(response);
  } catch (error) {
    console.error("Error al buscar el lugar:", error);
    res.status(500).json({ 
        error: "Error al buscar el lugar", 
        detalle: error.message 
      });
  }
};

const createLugar = async (req, res) => {
    let logoPath; // guardamos la ruta para borrar en caso de error
    try {
      const body = req.body;
      const logo = req.file;

      // normalizamos valores
      if (body.lugares_order !== undefined) {
        body.lugares_order = Number(body.lugares_order) || 0;
      } else {
        body.lugares_order = 0;
      }
      if (body.is_featured !== undefined) {
        body.is_featured = body.is_featured === true || body.is_featured === "true";
      }
  
      if (logo) {
        logoPath = path.join("public", "uploads", logo.filename);
        const logoUrl = `${req.protocol}://${req.get("host")}/uploads/${logo.filename}`;
        body.logo_url = logoUrl;
      }
  
      const response = await lugarModel.createLugar(body);
      res.json(response);
    } catch (error) {
      console.error("Error al crear el lugar:", error);
  
      // Si hubo imagen subida, borrarla
      if (logoPath && fs.existsSync(logoPath)) {
        try {
          fs.unlinkSync(logoPath);
          console.log(`Archivo eliminado: ${logoPath}`);
        } catch (unlinkErr) {
          console.error("Error al eliminar el archivo subido:", unlinkErr);
        }
      }
  
      res.status(500).json({ 
        error: "Error al crear el lugar", 
        detalle: error.message 
      });
    }
  };

const updateLugar = async (req, res) => {
  try {
    const { lugar_id } = req.params;
    let newData = req.body;

    // normalizamos valores
    if (newData.lugares_order !== undefined) {
        newData.lugares_order = Number(newData.lugares_order) || 0;
    }
    if (newData.is_featured !== undefined) {
        newData.is_featured = newData.is_featured === true || newData.is_featured === "true";
    }

    if (req.file) {
      const logoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      newData.logo_url = logoUrl;
    }

    const response = await lugarModel.updateLugar(lugar_id, newData);
    res.json(response);
  } catch (error) {
    console.error("Error al actualizar el lugar:", error);
    res.status(500).json({ 
        error: "Error al actualizar el lugar", 
        detalle: error.message 
    });
  }
};

const deleteLugar = async (req, res) => {
  try {
    const { lugar_id } = req.params;
    const response = await lugarModel.deleteLugar(lugar_id);
    res.json(response);
  } catch (error) {
    console.error("Error al eliminar el lugar:", error);
    res.status(500).json({ error: "Error al eliminar el lugar" });
  }
};

const getBySeccionPadre = async (req, res) => {
    try {
      const { seccion_padre } = req.params;
      const response = await lugarModel.findBySeccionPadre(seccion_padre);
      res.json(response);
    } catch (error) {
      console.error("Error al obtener lugares por sección padre:", error);
      res.status(500).json({ error: "Error al obtener lugares por sección padre" });
    }
  };

  const getBySeccionPadreAndNombre = async (req, res) => {
    try {
      const { seccion_padre, seccion_nombre } = req.params;
      const lugares = await lugarModel.findBySeccionPadreAndNombre(seccion_padre, seccion_nombre);
  
      if (!lugares.length) {
        return res.status(404).json({ error: "No se encontraron lugares con esos criterios" });
      }
  
      res.json(lugares);
    } catch (error) {
      console.error("Error al obtener lugares por sección padre y nombre:", error);
      res.status(500).json({ error: "Error al obtener lugares" });
    }
  };

export const lugarController = {
  getAll,
  getLugarById,
  createLugar,
  updateLugar,
  deleteLugar,
  getBySeccionPadre,
  getBySeccionPadreAndNombre
};

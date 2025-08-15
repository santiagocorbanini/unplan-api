import { seccionModel } from "../models/seccion.model.js";

const getAll = async (_, res) => {
  try {
    const secciones = await seccionModel.findAll();
    res.json(secciones);
  } catch (error) {
    console.error("Error al obtener secciones:", error);
    res.status(500).json({ error: "Error al obtener secciones" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const seccion = await seccionModel.getById(id);
    res.json(seccion);
  } catch (error) {
    console.error("Error al obtener sección:", error);
    res.status(404).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const newSeccion = await seccionModel.create(data);
    res.status(201).json(newSeccion);
  } catch (error) {
    console.error("Error al crear sección:", error);
    res.status(500).json({ error: "Error al crear sección" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedSeccion = await seccionModel.update(id, data);
    res.json(updatedSeccion);
  } catch (error) {
    console.error("Error al actualizar sección:", error);
    if (error.message === "Sección no encontrada") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error al actualizar sección" });
    }
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSeccion = await seccionModel.remove(id);
    res.json({ message: "Sección eliminada correctamente", deletedSeccion });
  } catch (error) {
    console.error("Error al eliminar sección:", error);
    if (error.message === "Sección no encontrada") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error al eliminar sección" });
    }
  }
};

const getByPadre = async (req, res) => {
    try {
      const { seccion_padre } = req.params;
      const validPadres = ['salir', 'comer', 'dormir', 'actividades', 'comercios'];
  
      if (!validPadres.includes(seccion_padre)) {
        return res.status(400).json({ error: "Valor de seccion_padre no válido" });
      }
  
      const secciones = await seccionModel.findByPadre(seccion_padre);
      res.json(secciones);
    } catch (error) {
      console.error("Error al obtener secciones por padre:", error);
      res.status(500).json({ error: "Error al obtener secciones por padre" });
    }
  };
  

export const seccionController = {
  getAll,
  getById,
  create,
  update,
  remove,
  getByPadre
};

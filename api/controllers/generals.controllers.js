// controllers/generals.controllers.js
import { generalsModel } from "../models/generals.model.js";

const getGenerals = async (_req, res) => {
  try {
    const data = await generalsModel.getGenerals();
    res.json(data);
  } catch (e) {
    console.error("[getGenerals] Error:", e);
    res.status(500).json({ error: "Error al obtener configuración general" });
  }
};

export const generalsController = { getGenerals };

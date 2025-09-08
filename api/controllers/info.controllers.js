import { infoModel } from "../models/info.model.js";

const getInfo = async (req, res) => {
  try {
    const info = await infoModel.getInfo();
    res.json(info);
  } catch (error) {
    console.error("[getInfo] Error:", error);
    res.status(500).json({ error: "Error al obtener la información" });
  }
};

const updateInfo = async (req, res) => {
  try {
    const data = req.body || {};
    const allowed = ["como_llegar", "numeros_utiles", "atractivos", "transporte"];

    // Tomamos solo claves permitidas que vengan en el body
    const payload = {};
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(data, k)) {
        payload[k] = data[k];
      }
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: "No se enviaron campos válidos para actualizar" });
    }

    const updated = await infoModel.updateInfo(payload);
    if (!updated) return res.status(404).json({ error: "No se encontró información para actualizar" });

    res.json(updated);
  } catch (error) {
    console.error("Error al actualizar la información: ", error);
    res.status(500).json({ 
        error: "Error al actualizar la información", 
        detalle: error.message 
    });
  }
};

export const infoController = { getInfo, updateInfo };

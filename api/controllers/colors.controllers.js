import { colorsModel } from "../models/colors.model.js";

const getColors = async (_req, res) => {
  try {
    const data = await colorsModel.getColors();
    res.json({
      id: data?.id ?? 1,
      general: data?.general ?? null,
      primary: data?.primary_color ?? null,   // mapeo DB → API
      background: data?.background ?? null,
    });
  } catch (e) {
    console.error("[getColors] Error:", e);
    res.status(500).json({ error: "Error al obtener los colores" });
  }
};

const updateColors = async (req, res) => {
  try {
    const body = req.body || {};
    // Permitimos estas keys en el body
    const allowed = ["general", "primary", "background"];

    // Filtrar y mapear al nombre de columna real
    const payload = {};
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(body, k)) {
        if (k === "primary") payload.primary_color = body[k];
        else payload[k] = body[k];
      }
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: "No se enviaron campos válidos para actualizar" });
    }

    const updated = await colorsModel.updateColors(payload);
    if (!updated) return res.status(404).json({ error: "No se encontró registro de colores" });

    // Responder con la forma del API (primary, no primary_color)
    res.json({
      id: updated.id,
      general: updated.general,
      primary: updated.primary_color,
      background: updated.background,
    });
  } catch (e) {
    console.error("[updateColors] Error:", e);
    res.status(500).json({ error: "Error al actualizar los colores" });
  }
};

export const colorsController = { getColors, updateColors };

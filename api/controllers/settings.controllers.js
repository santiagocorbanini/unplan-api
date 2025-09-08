// controllers/settings.controllers.js
import { settingsModel } from "../models/settings.model.js";

const isEmail = (v) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const normalizeInstagram = (v) => {
  if (typeof v !== "string") return v;
  const trimmed = v.trim();
  if (trimmed.startsWith("http")) {
    const m = trimmed.match(/instagram\.com\/([^\/\?\s]+)/i);
    return m ? m[1].replace(/^@/, "") : trimmed;
  }
  return trimmed.replace(/^@/, "");
};

const getSettings = async (_req, res) => {
  try {
    const data = await settingsModel.getSettings();
    res.json(
      data ?? { id: 1, title: "", description: "", email: "", instagram: "", telephone: "" }
    );
  } catch (e) {
    console.error("[getSettings] Error:", e);
    res.status(500).json({ error: "Error al obtener settings" });
  }
};

const updateSettings = async (req, res) => {
  try {
    const b = req.body || {};
    const payload = {};

    if ("title" in b) payload.title = String(b.title ?? "");
    if ("description" in b) payload.description = String(b.description ?? "");
    if ("email" in b) {
      if (b.email && !isEmail(b.email)) {
        return res.status(400).json({ error: "Email inválido" });
      }
      payload.email = b.email ?? "";
    }
    if ("instagram" in b) {
      payload.instagram = normalizeInstagram(b.instagram ?? "");
    }
    if ("telephone" in b) {
      payload.telephone = String(b.telephone ?? "");
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: "No se enviaron campos válidos" });
    }

    const updated = await settingsModel.updateSettings(payload);
    res.json(updated);
  } catch (error) {
    console.error("Error al actualizar settings:", error);
    res.status(500).json({ 
        error: "Error al actualizar el lugar", 
        detalle: error.message 
    });
  }
};

export const settingsController = { getSettings, updateSettings };

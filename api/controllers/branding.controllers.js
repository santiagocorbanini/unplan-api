// controllers/branding.controllers.js
import fs from "fs";
import path from "path";
import { brandingModel } from "../models/branding.model.js";

const getBranding = async (_req, res) => {
  try {
    const data = await brandingModel.getBranding();
    res.json(data ?? { id: 1, logo_url: "", banner_url: "", icon_url: "" });
  } catch (e) {
    console.error("[getBranding] Error:", e);
    res.status(500).json({ error: "Error al obtener branding" });
  }
};

const updateBranding = async (req, res) => {
  // req.files?.logo / req.files?.banner / req.files?.icon pueden existir (multer.fields)
  // También permitimos actualizar por JSON (logo_url/banner_url/icon_url en body)
  const uploadedPaths = []; // para cleanup si falla
  try {
    const current = await brandingModel.getBranding();

    // Construir payload con URLs nuevas si hay archivos o si mandan URLs directas
    const payload = {};

    // LOGO
    if (req.files?.logo?.[0]) {
      const f = req.files.logo[0];
      uploadedPaths.push(path.join("public", "uploads", f.filename));
      payload.logo_url = `${req.protocol}://${req.get("host")}/uploads/${f.filename}`;
    } else if (req.body?.logo_url) {
      payload.logo_url = req.body.logo_url;
    }

    // BANNER
    if (req.files?.banner?.[0]) {
      const f = req.files.banner[0];
      uploadedPaths.push(path.join("public", "uploads", f.filename));
      payload.banner_url = `${req.protocol}://${req.get("host")}/uploads/${f.filename}`;
    } else if (req.body?.banner_url) {
      payload.banner_url = req.body.banner_url;
    }

    // ICON
    if (req.files?.icon?.[0]) {
      const f = req.files.icon[0];
      uploadedPaths.push(path.join("public", "uploads", f.filename));
      payload.icon_url = `${req.protocol}://${req.get("host")}/uploads/${f.filename}`;
    } else if (req.body?.icon_url) {
      payload.icon_url = req.body.icon_url;
    }

    if (Object.keys(payload).length === 0) {
      return res
        .status(400)
        .json({ error: "No se enviaron campos para actualizar (logo, banner o icon)" });
    }

    // Actualizar DB
    const updated = await brandingModel.updateBranding(payload);

    // Borrar archivos anteriores si fueron reemplazados
    // LOGO
    if (payload.logo_url && current?.logo_url && current.logo_url !== payload.logo_url) {
      const oldFile = current.logo_url.split("/").pop();
      const oldPath = path.resolve("public/uploads", oldFile);
      fs.promises.unlink(oldPath).catch(() =>
        console.warn("[updateBranding] No se pudo eliminar logo anterior:", oldPath)
      );
    }

    // BANNER
    if (payload.banner_url && current?.banner_url && current.banner_url !== payload.banner_url) {
      const oldFile = current.banner_url.split("/").pop();
      const oldPath = path.resolve("public/uploads", oldFile);
      fs.promises.unlink(oldPath).catch(() =>
        console.warn("[updateBranding] No se pudo eliminar banner anterior:", oldPath)
      );
    }

    // ICON
    if (payload.icon_url && current?.icon_url && current.icon_url !== payload.icon_url) {
      const oldFile = current.icon_url.split("/").pop();
      const oldPath = path.resolve("public/uploads", oldFile);
      fs.promises.unlink(oldPath).catch(() =>
        console.warn("[updateBranding] No se pudo eliminar icon anterior:", oldPath)
      );
    }

    res.json(updated);
  } catch (e) {
    console.error("[updateBranding] Error:", e);
    // Cleanup de archivos recién subidos si hubo error
    for (const p of uploadedPaths) {
      try {
        if (fs.existsSync(p)) fs.unlinkSync(p);
      } catch {}
    }
    res.status(500).json({ error: "Error al actualizar branding" });
  }
};

export const brandingController = { getBranding, updateBranding };

import path from "path";
import fs from "fs";
import { bannerModel } from "../models/banner.model.js";

const getAll = async (req, res) => {
  try {
    const rows = await bannerModel.findAll();
    res.json(rows);
  } catch (e) {
    console.error("Error al obtener banners:", e);
    res.status(500).json({ error: "Error al obtener banners" });
  }
};

const getById = async (req, res) => {
  try {
    const row = await bannerModel.getById(req.params.banner_id);
    res.json(row);
  } catch (e) {
    console.error("Error al obtener banner:", e);
    res.status(404).json({ error: "Banner no encontrado" });
  }
};

const createBanner = async (req, res) => {
  let savedPath;
  try {
    const { banner_order, available } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Se requiere una imagen (campo 'image')." });
    }

    savedPath = path.join("public", "uploads", "banners", file.filename);
    const image_url = `${req.protocol}://${req.get("host")}/uploads/banners/${file.filename}`;

    const created = await bannerModel.createBanner({
      image_url,
      banner_order: banner_order !== undefined ? Number(banner_order) : undefined,
      available: available !== undefined ? JSON.parse(String(available)) : undefined,
    });

    res.json(created);
  } catch (e) {
    console.error("Error al crear banner:", e);
    if (savedPath && fs.existsSync(savedPath)) {
      try { fs.unlinkSync(savedPath); } catch {}
    }
    res.status(500).json({ error: "Error al crear banner" });
  }
};

const updateBanner = async (req, res) => {
  try {
    const id = req.params.banner_id;
    let newData = { ...req.body };

    if (req.file) {
      const image_url = `${req.protocol}://${req.get("host")}/uploads/banners/${req.file.filename}`;
      newData.image_url = image_url;

      try {
        const current = await bannerModel.getById(id);
        if (current?.image_url) {
          const oldName = current.image_url.split("/").pop();
          const oldPath = path.resolve("public/uploads/banners", oldName);
          if (fs.existsSync(oldPath)) await fs.promises.unlink(oldPath);
        }
      } catch (e) {
        console.warn("No se pudo eliminar imagen anterior:", e.message);
      }
    }

    if (newData.banner_order !== undefined) newData.banner_order = Number(newData.banner_order);
    if (newData.available !== undefined) newData.available = JSON.parse(String(newData.available));

    const updated = await bannerModel.updateBanner(id, newData);
    res.json(updated);
  } catch (e) {
    console.error("Error al actualizar banner:", e);
    res.status(500).json({ error: "Error al actualizar banner" });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const id = req.params.banner_id;
    const deleted = await bannerModel.deleteBanner(id);
    res.json(deleted);
  } catch (e) {
    console.error("Error al eliminar banner:", e);
    res.status(500).json({ error: "Error al eliminar banner" });
  }
};

const getAvailable = async (req, res) => {
    try {
      const rows = await bannerModel.findAvailable();
      res.json(rows);
    } catch (e) {
      console.error("Error al obtener banners disponibles:", e);
      res.status(500).json({ error: "Error al obtener banners disponibles" });
    }
  };

export const bannerController = {
  getAll,
  getById,
  createBanner,
  updateBanner,
  deleteBanner,
  getAvailable
};

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // formato: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // tu clave secreta
    req.user = decoded; // podés guardar info útil como el user_id
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

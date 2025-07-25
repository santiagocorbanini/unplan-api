import "dotenv/config";
import express from "express";
import showRoute from "./routes/show.routes.js";
import path from "path";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json({ limit: "10mb" })); // Cambia "10mb" según sea necesario
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join("public/uploads")));

/*
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];
*/

app.use((req, res, next) => {
  const origin = req.headers.origin;
   /*
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
    */
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
app.use("/auth", authRoutes); // ahora tendrás POST /auth/login

app.use("/shows", showRoute);

const PORT = process.env.PORT || 5000;

/*
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
*/
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
  });

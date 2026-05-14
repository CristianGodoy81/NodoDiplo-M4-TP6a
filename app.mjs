import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.mjs";
import authRoutes from "./src/routes/authRoutes.mjs";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión DB
connectDB();

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API Nodo Cine funcionando");
});
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
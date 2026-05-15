import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.mjs";
import authRoutes from "./src/routes/authRoutes.mjs";
import profileRoutes from "./src/routes/profileRoutes.mjs";
import movieRoutes from "./src/routes/movieRoutes.mjs";
import watchlistRoutes from "./src/routes/watchlistRoutes.mjs";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión DB
connectDB();

// Rutas
app.get("/", (req, res) => {
  res.send("API Nodo Cine funcionando");
});
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchlistRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

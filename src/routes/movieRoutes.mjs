import express from "express";
import {
  getTrailer,
  importMovies,
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie
} from "../controllers/movieController.mjs";

import { authMiddleware } from "../middlewares/authMiddleware.mjs";
import { adminMiddleware } from "../middlewares/roleMiddleware.mjs";

const router = express.Router();

router.use(authMiddleware);

// Públicas para usuarios logueados
router.get("/", getMovies);
router.get("/:id/trailer", getTrailer);

// Solo admin
router.post("/import", adminMiddleware, importMovies);
router.post("/", adminMiddleware, createMovie);
router.put("/:id", adminMiddleware, updateMovie);
router.delete("/:id", adminMiddleware, deleteMovie);

export default router;

import express from "express";
import {
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

// Solo admin
router.post("/", adminMiddleware, createMovie);
router.put("/:id", adminMiddleware, updateMovie);
router.delete("/:id", adminMiddleware, deleteMovie);

export default router;

import express from "express";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist
} from "../controllers/watchlistController.mjs";

import { authMiddleware } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addToWatchlist);
router.get("/:profileId", getWatchlist);
router.delete("/:id", removeFromWatchlist);

export default router;
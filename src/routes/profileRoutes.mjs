import express from "express";
import {
  createProfile,
  getProfiles,
  updateProfile,
  deleteProfile
} from "../controllers/profileController.mjs";

import { authMiddleware } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

// todas protegidas
router.use(authMiddleware);

router.post("/", createProfile);
router.get("/", getProfiles);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);

export default router;
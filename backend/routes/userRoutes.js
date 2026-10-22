import express from "express";
import {
  updateProfile,
  changePassword,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.patch("/profile", protect, upload.single("avatar"), updateProfile);

router.patch("/change-password", protect, changePassword);

export default router;

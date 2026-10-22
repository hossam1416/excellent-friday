import express from "express";
import {
  getLeaderboard,
  getHeadToHead,
} from "../controllers/leaderboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getLeaderboard);
router.get("/head-to-head", protect, getHeadToHead);

export default router;

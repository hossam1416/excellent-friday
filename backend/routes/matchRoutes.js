import express from "express";

import {
  createMatch,
  updateLastMatch,
  getTournamentMatches,
  getMatchById,
} from "../controllers/matchController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createMatch);
router.patch("/:id", protect, adminOnly, updateLastMatch);
router.get("/tournament/:tournamentId", protect, getTournamentMatches);
router.get("/:id", protect, getMatchById);
export default router;

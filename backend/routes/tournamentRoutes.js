import express from "express";

import {
  createTournament,
  startTournament,
  endTournament,
  getTournaments,
  getTournamentById,
  getTournamentStandings,
} from "../controllers/tournamentController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createTournament);

router.patch("/:id/start", protect, adminOnly, startTournament);

router.patch("/:id/end", protect, adminOnly, endTournament);

router.get("/", protect, getTournaments);

router.get("/:id/standings", protect, getTournamentStandings);

router.get("/:id", protect, getTournamentById);

export default router;

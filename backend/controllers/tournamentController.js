import Tournament from "../models/Tournament.js";
import User from "../models/User.js";
import Match from "../models/Match.js";

import {
  evaluateTournament,
  getNextMatchup,
} from "../services/tournamentService.js";

export const createTournament = async (req, res) => {
  try {
    const { name } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "اسم البطولة مطلوب",
      });
    }

    const activeTournament = await Tournament.findOne({
      status: "active",
    });

    if (activeTournament) {
      return res.status(409).json({
        message: "يوجد بطولة نشطة بالفعل",
      });
    }

    const players = await User.find().select("_id");

    if (players.length !== 3) {
      return res.status(400).json({
        message: "يجب أن يكون هناك ثلاثة لاعبين مسجلين بالضبط",
      });
    }

    const tournament = await Tournament.create({
      name: name.trim(),
      players: players.map((player) => player._id),
    });

    return res.status(201).json({
      message: "تم إنشاء البطولة بنجاح",
      tournament,
    });
  } catch (error) {
    console.error("Create tournament failed:", error.message);

    return res.status(500).json({
      message: "حدث خطأ أثناء إنشاء البطولة",
    });
  }
};

export const startTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        message: "البطولة غير موجودة",
      });
    }

    if (tournament.status !== "pending") {
      return res.status(400).json({
        message: "لا يمكن بدء هذه البطولة",
      });
    }

    const activeTournament = await Tournament.findOne({
      status: "active",
      _id: { $ne: tournament._id },
    });

    if (activeTournament) {
      return res.status(409).json({
        message: "يوجد بطولة نشطة بالفعل",
      });
    }

    tournament.status = "active";

    await tournament.save();

    return res.status(200).json({
      message: "تم بدء البطولة بنجاح",
      tournament,
    });
  } catch (error) {
    console.error("Start tournament failed:", error.message);

    return res.status(500).json({
      message: "حدث خطأ أثناء بدء البطولة",
    });
  }
};

export const endTournament = async (req, res) => {
  try {
    const { championId } = req.body;

    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        message: "البطولة غير موجودة",
      });
    }

    if (tournament.status !== "active") {
      return res.status(400).json({
        message: "البطولة ليست نشطة",
      });
    }

    if (championId) {
      const isParticipant = tournament.players.some(
        (playerId) => playerId.toString() === championId,
      );

      if (!isParticipant) {
        return res.status(400).json({
          message: "البطل يجب أن يكون أحد لاعبي البطولة",
        });
      }
    }

    tournament.status = "completed";
    tournament.champion = championId || null;
    tournament.endReason = "manual";

    await tournament.save();

    return res.status(200).json({
      message: "تم إنهاء البطولة يدويًا بنجاح",
      tournament,
    });
  } catch (error) {
    console.error("End tournament failed:", error.message);

    return res.status(500).json({
      message: "حدث خطأ أثناء إنهاء البطولة",
    });
  }
};

export const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate("players", "username avatar")
      .populate("champion", "username avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: tournaments.length,
      tournaments,
    });
  } catch (error) {
    console.error("Get tournaments failed:", error.message);

    return res.status(500).json({
      message: "حدث خطأ أثناء جلب البطولات",
    });
  }
};

export const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate("players", "username avatar")
      .populate("champion", "username avatar");

    if (!tournament) {
      return res.status(404).json({
        message: "البطولة غير موجودة",
      });
    }

    return res.status(200).json({ tournament });
  } catch (error) {
    console.error("Get tournament failed:", error.message);

    return res.status(500).json({
      message: "حدث خطأ أثناء جلب البطولة",
    });
  }
};

export const getTournamentStandings = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        message: "البطولة غير موجودة",
      });
    }

    const players = await User.find({
      _id: { $in: tournament.players },
    }).select("_id username avatar");

    const matches = await Match.find({
      tournament: tournament._id,
    }).sort({ createdAt: 1, _id: 1 });

    const mainMatches = matches.filter((match) => !match.isFinalMatch);

    const hasFinal = matches.some((match) => match.isFinalMatch);

    const evaluation = evaluateTournament(players, mainMatches);

    const requiresFinalMatch =
      tournament.status === "active" &&
      evaluation.requiresFinalMatch &&
      !hasFinal;

    const nextMatchup =
      tournament.status === "active" &&
      mainMatches.length > 0 &&
      mainMatches.length < 10
        ? getNextMatchup(mainMatches, tournament.players)
        : null;

    return res.status(200).json({
      standings: evaluation.standings,
      mainMatchesPlayed: mainMatches.length,
      requiresFinalMatch,
      finalMatchPlayers: requiresFinalMatch
        ? [evaluation.standings[0].player, evaluation.standings[1].player]
        : null,
      nextMatchup,
    });
  } catch (error) {
    console.error("Get standings failed:", error.message);

    return res.status(500).json({
      message: "حدث خطأ أثناء جلب الترتيب",
    });
  }
};

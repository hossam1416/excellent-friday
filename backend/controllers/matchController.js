import Match from "../models/Match.js";
import Tournament from "../models/Tournament.js";
import User from "../models/User.js";
import {
  getNextMatchup,
  evaluateTournament,
} from "../services/tournamentService.js";

export const createMatch = async (req, res) => {
  try {
    const {
      tournamentId,
      playerOneId,
      playerTwoId,
      scorePlayerOne,
      scorePlayerTwo,
      decidedByPenalties,
      penaltyWinnerId,
    } = req.body;

    if (
      !tournamentId ||
      !playerOneId ||
      !playerTwoId ||
      scorePlayerOne === undefined ||
      scorePlayerTwo === undefined
    ) {
      return res.status(400).json({
        message: "يرجى إدخال بيانات المباراة كاملة",
      });
    }

    if (
      !Number.isInteger(scorePlayerOne) ||
      !Number.isInteger(scorePlayerTwo) ||
      scorePlayerOne < 0 ||
      scorePlayerTwo < 0
    ) {
      return res.status(400).json({
        message: "نتيجة المباراة يجب أن تكون أعدادًا صحيحة غير سالبة",
      });
    }

    if (playerOneId === playerTwoId) {
      return res.status(400).json({
        message: "لا يمكن للاعب مواجهة نفسه",
      });
    }

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({
        message: "البطولة غير موجودة",
      });
    }

    if (tournament.status !== "active") {
      return res.status(400).json({
        message: "لا يمكن تسجيل مباراة لبطولة غير نشطة",
      });
    }

    const matches = await Match.find({
      tournament: tournamentId,
    }).sort({ createdAt: 1, _id: 1 });

    const mainMatches = matches.filter((match) => !match.isFinalMatch);

    const finalMatches = matches.filter((match) => match.isFinalMatch);

    if (finalMatches.length > 0) {
      return res.status(400).json({
        message: "تم تسجيل المباراة النهائية مسبقًا",
      });
    }

    if (mainMatches.length > 10) {
      return res.status(400).json({
        message: "تجاوز عدد المباريات الأساسية الحد المسموح",
      });
    }

    if (mainMatches.length > 0 && mainMatches.length < 10) {
      const expectedMatchup = getNextMatchup(mainMatches, tournament.players);

      if (!expectedMatchup) {
        return res.status(400).json({
          message: "تعذر تحديد المواجهة التالية للبطولة",
        });
      }

      const [expectedPlayerOne, expectedPlayerTwo] = expectedMatchup;

      const isCorrectMatchup =
        [playerOneId, playerTwoId].includes(expectedPlayerOne.toString()) &&
        [playerOneId, playerTwoId].includes(expectedPlayerTwo.toString());

      if (!isCorrectMatchup) {
        return res.status(400).json({
          message: "المواجهة غير صحيحة، يجب الالتزام بترتيب البطولة",
          expectedMatchup: [
            expectedPlayerOne.toString(),
            expectedPlayerTwo.toString(),
          ],
        });
      }
    }

    let isFinalMatch = false;

    if (mainMatches.length === 10) {
      const evaluation = evaluateTournament(
        await User.find({
          _id: { $in: tournament.players },
        }).select("_id username avatar"),
        mainMatches,
      );

      if (!evaluation.requiresFinalMatch) {
        return res.status(400).json({
          message: "لا توجد حاجة إلى مباراة فاصلة لهذه البطولة",
        });
      }

      const [first, second] = evaluation.standings;

      const isCorrectFinalMatch =
        [playerOneId, playerTwoId].includes(first.player.id.toString()) &&
        [playerOneId, playerTwoId].includes(second.player.id.toString());

      if (!isCorrectFinalMatch) {
        return res.status(400).json({
          message: "المباراة الفاصلة يجب أن تكون بين المتصدرين المتعادلين",
          expectedMatchup: [
            first.player.id.toString(),
            second.player.id.toString(),
          ],
        });
      }

      isFinalMatch = true;
    }

    const playersAreParticipants = [playerOneId, playerTwoId].every(
      (playerId) =>
        tournament.players.some(
          (participantId) => participantId.toString() === playerId,
        ),
    );

    if (!playersAreParticipants) {
      return res.status(400).json({
        message: "يجب أن يكون اللاعبان مشاركين في البطولة",
      });
    }

    const tournamentPlayers = await User.find({
      _id: { $in: tournament.players },
    }).select("_id username avatar");

    if (tournamentPlayers.length !== tournament.players.length) {
      return res.status(400).json({
        message: "تعذر العثور على جميع لاعبي البطولة",
      });
    }

    const isDraw = scorePlayerOne === scorePlayerTwo;

    if (isDraw && !decidedByPenalties) {
      return res.status(400).json({
        message: "يجب تحديد الفائز بركلات الترجيح عند التعادل",
      });
    }

    if (!isDraw && decidedByPenalties) {
      return res.status(400).json({
        message: "ركلات الترجيح تستخدم فقط عند التعادل",
      });
    }

    let winner = null;

    if (isDraw) {
      if (penaltyWinnerId !== playerOneId && penaltyWinnerId !== playerTwoId) {
        return res.status(400).json({
          message: "يجب تحديد أحد اللاعبين فائزًا بركلات الترجيح",
        });
      }

      winner = penaltyWinnerId;
    } else {
      winner = scorePlayerOne > scorePlayerTwo ? playerOneId : playerTwoId;
    }

    const match = await Match.create({
      tournament: tournamentId,
      playerOne: playerOneId,
      playerTwo: playerTwoId,
      scorePlayerOne,
      scorePlayerTwo,
      winner,
      decidedByPenalties: Boolean(decidedByPenalties),
      isFinalMatch,
    });

    const updatedMatches = [...matches, match];

    if (isFinalMatch) {
      tournament.status = "completed";
      tournament.endReason = "max_matches";
      tournament.champion = winner;

      await tournament.save();
    }

    const evaluation = evaluateTournament(tournamentPlayers, updatedMatches);

    if (!isFinalMatch && evaluation.shouldEnd) {
      tournament.status = "completed";
      tournament.endReason = evaluation.endReason;
      tournament.champion = evaluation.champion;

      await tournament.save();
    }

    return res.status(201).json({
      message: isFinalMatch
        ? "تم تسجيل المباراة الفاصلة وانتهت البطولة"
        : evaluation.shouldEnd
          ? "تم تسجيل المباراة وانتهت البطولة"
          : evaluation.requiresFinalMatch
            ? "تم تسجيل المباراة العاشرة، ويجب لعب مباراة فاصلة لتحديد البطل"
            : "تم تسجيل المباراة بنجاح",

      match,
      tournament: {
        status: tournament.status,
        endReason: tournament.endReason,
        champion: tournament.champion,
      },
      standings: evaluation.standings,
    });
  } catch (error) {
    console.error("Create match failed:", error.message);

    return res.status(500).json({
      message: "حدث خطأ أثناء تسجيل المباراة",
    });
  }
};

export const getTournamentMatches = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({
        message: "البطولة غير موجودة",
      });
    }

    const matches = await Match.find({ tournament: tournamentId })
      .populate("playerOne", "username avatar")
      .populate("playerTwo", "username avatar")
      .populate("winner", "username avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error("Get tournament matches failed:", error.message);

    return res.status(500).json({
      message: "حدث خطأ أثناء جلب مباريات البطولة",
    });
  }
};

export const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("playerOne", "username avatar")
      .populate("playerTwo", "username avatar")
      .populate("winner", "username avatar")
      .populate("tournament", "name status");

    if (!match) {
      return res.status(404).json({
        message: "المباراة غير موجودة",
      });
    }

    return res.status(200).json({ match });
  } catch (error) {
    console.error("Get match failed:", error.message);

    return res.status(500).json({
      message: "حدث خطأ أثناء جلب المباراة",
    });
  }
};

export const updateLastMatch = async (req, res) => {
  try {
    const {
      scorePlayerOne,
      scorePlayerTwo,
      decidedByPenalties,
      penaltyWinnerId,
    } = req.body;

    if (
      !Number.isInteger(scorePlayerOne) ||
      !Number.isInteger(scorePlayerTwo) ||
      scorePlayerOne < 0 ||
      scorePlayerTwo < 0 ||
      typeof decidedByPenalties !== "boolean"
    ) {
      return res.status(400).json({
        message: "يرجى إدخال نتيجة صحيحة",
      });
    }

    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        message: "المباراة غير موجودة",
      });
    }

    const tournament = await Tournament.findById(match.tournament);

    if (!tournament) {
      return res.status(404).json({
        message: "البطولة غير موجودة",
      });
    }

    // لازم تكون آخر مباراة بالبطولة
    const lastMatch = await Match.findOne({
      tournament: tournament._id,
    }).sort({ createdAt: -1, _id: -1 });

    if (!lastMatch || lastMatch._id.toString() !== match._id.toString()) {
      return res.status(400).json({
        message: "يمكن تعديل آخر مباراة فقط",
      });
    }

    // ما منعدل بطولة انتهت يدويًا
    if (tournament.endReason === "manual") {
      return res.status(400).json({
        message: "لا يمكن تعديل مباراة بطولة أُنهيت يدويًا",
      });
    }

    // ما منعدل بطولة منتهية إذا في بطولة ثانية نشطة
    if (tournament.status !== "active") {
      const otherActive = await Tournament.findOne({ status: "active" });

      if (otherActive) {
        return res.status(409).json({
          message: "يوجد بطولة نشطة، لا يمكن تعديل مباراة بطولة منتهية",
        });
      }
    }

    const isDraw = scorePlayerOne === scorePlayerTwo;

    if (isDraw && !decidedByPenalties) {
      return res.status(400).json({
        message: "يجب تحديد الفائز بركلات الترجيح عند التعادل",
      });
    }

    if (!isDraw && decidedByPenalties) {
      return res.status(400).json({
        message: "ركلات الترجيح تستخدم فقط عند التعادل",
      });
    }

    let winner;

    if (isDraw) {
      if (
        !penaltyWinnerId ||
        ![match.playerOne.toString(), match.playerTwo.toString()].includes(
          penaltyWinnerId,
        )
      ) {
        return res.status(400).json({
          message: "يجب تحديد أحد اللاعبين فائزًا بركلات الترجيح",
        });
      }

      winner = penaltyWinnerId;
    } else {
      winner =
        scorePlayerOne > scorePlayerTwo ? match.playerOne : match.playerTwo;
    }

    // نجيب اللاعبين قبل الحفظ، عشان ما ننحفظ شي ثم نرجع خطأ
    const tournamentPlayers = await User.find({
      _id: { $in: tournament.players },
    }).select("_id username avatar");

    if (tournamentPlayers.length !== tournament.players.length) {
      return res.status(400).json({
        message: "تعذر العثور على جميع لاعبي البطولة",
      });
    }

    match.scorePlayerOne = scorePlayerOne;
    match.scorePlayerTwo = scorePlayerTwo;
    match.winner = winner;
    match.decidedByPenalties = decidedByPenalties;

    await match.save();

    // نحسب الترتيب من جديد بعد التعديل
    const matches = await Match.find({
      tournament: tournament._id,
    }).sort({ createdAt: 1, _id: 1 });

    const evaluation = evaluateTournament(tournamentPlayers, matches);

    if (match.isFinalMatch) {
      // الماتش الفاصل: البطل هو الفائز فيه
      tournament.status = "completed";
      tournament.endReason = "max_matches";
      tournament.champion = winner;
    } else {
      tournament.status = evaluation.shouldEnd ? "completed" : "active";
      tournament.endReason = evaluation.endReason;
      tournament.champion = evaluation.champion;
    }

    await tournament.save();

    return res.status(200).json({
      message: "تم تعديل آخر مباراة وتحديث ترتيب البطولة",
      match,
      tournament: {
        status: tournament.status,
        endReason: tournament.endReason,
        champion: tournament.champion,
      },
      standings: evaluation.standings,
      requiresFinalMatch: !match.isFinalMatch && evaluation.requiresFinalMatch,
    });
  } catch (error) {
    console.error("Update last match failed:", error.message);

    return res.status(500).json({
      message: "حدث خطأ أثناء تعديل المباراة",
    });
  }
};

import User from "../models/User.js";
import Tournament from "../models/Tournament.js";
import Match from "../models/Match.js";

export const getLeaderboard = async (req, res) => {
  try {
    const players = await User.find().select("_id username avatar");

    const completedTournaments = await Tournament.find({
      status: "completed",
    }).select("_id champion players");

    const tournamentIds = completedTournaments.map(
      (tournament) => tournament._id,
    );

    const matches = await Match.find({
      tournament: { $in: tournamentIds },
      isFinalMatch: { $ne: true },
    });

    const leaderboard = players.map((player) => {
      const playerMatches = matches.filter(
        (match) =>
          match.playerOne.toString() === player._id.toString() ||
          match.playerTwo.toString() === player._id.toString(),
      );

      const stats = {
        player: {
          id: player._id,
          username: player.username,
          avatar: player.avatar,
        },
        tournamentsPlayed: completedTournaments.filter((tournament) =>
          tournamentIds.some(
            (id) =>
              id.toString() === tournament._id.toString() &&
              tournament.players?.some?.(
                (playerId) => playerId.toString() === player._id.toString(),
              ),
          ),
        ).length,
        titles: completedTournaments.filter(
          (tournament) =>
            tournament.champion?.toString() === player._id.toString(),
        ).length,
        matchesPlayed: playerMatches.length,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
      };

      for (const match of playerMatches) {
        const isPlayerOne =
          match.playerOne.toString() === player._id.toString();

        const goalsFor = isPlayerOne
          ? match.scorePlayerOne
          : match.scorePlayerTwo;

        const goalsAgainst = isPlayerOne
          ? match.scorePlayerTwo
          : match.scorePlayerOne;

        stats.goalsFor += goalsFor;
        stats.goalsAgainst += goalsAgainst;

        if (goalsFor === goalsAgainst) {
          stats.draws += 1;
          stats.points += 1;
        } else if (goalsFor > goalsAgainst) {
          stats.wins += 1;
          stats.points += 3;
        } else {
          stats.losses += 1;
        }
      }

      stats.goalDifference = stats.goalsFor - stats.goalsAgainst;

      return stats;
    });

    leaderboard.sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor,
    );

    return res.status(200).json({
      leaderboard,
    });
  } catch (error) {
    console.error("Get leaderboard failed:", error.message);

    return res.status(500).json({
      message: "حدث خطأ أثناء جلب الترتيب العام",
    });
  }
};
export const getHeadToHead = async (req, res) => {
  try {
    const players = await User.find().select("_id username avatar");

    const completedTournaments = await Tournament.find({
      status: "completed",
    }).select("_id");

    const tournamentIds = completedTournaments.map(
      (tournament) => tournament._id,
    );

    const matches = await Match.find({
      tournament: { $in: tournamentIds },
      isFinalMatch: { $ne: true },
    });

    const headToHead = [];

    // كل زوج لاعبين مرة وحدة
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        const a = players[i];
        const b = players[j];

        const stats = {
          matches: 0,
          winsOne: 0,
          winsTwo: 0,
          draws: 0,
          goalsOne: 0,
          goalsTwo: 0,
        };

        for (const match of matches) {
          const playerOneId = match.playerOne.toString();
          const playerTwoId = match.playerTwo.toString();
          const aId = a._id.toString();
          const bId = b._id.toString();

          // المباراة لازم تكون بين a و b (بأي ترتيب)
          const isPair =
            (playerOneId === aId && playerTwoId === bId) ||
            (playerOneId === bId && playerTwoId === aId);

          if (!isPair) continue;

          const aIsFirst = playerOneId === aId;
          const goalsA = aIsFirst ? match.scorePlayerOne : match.scorePlayerTwo;
          const goalsB = aIsFirst ? match.scorePlayerTwo : match.scorePlayerOne;

          stats.matches += 1;
          stats.goalsOne += goalsA;
          stats.goalsTwo += goalsB;

          // الفوز بالنتيجة، والتعادل بالركلات بيضل تعادل
          if (goalsA > goalsB) stats.winsOne += 1;
          else if (goalsA < goalsB) stats.winsTwo += 1;
          else stats.draws += 1;
        }

        headToHead.push({
          playerOne: { id: a._id, username: a.username, avatar: a.avatar },
          playerTwo: { id: b._id, username: b.username, avatar: b.avatar },
          ...stats,
        });
      }
    }

    return res.status(200).json({ headToHead });
  } catch (error) {
    console.error("Get head to head failed:", error.message);

    return res.status(500).json({
      message: "حدث خطأ أثناء جلب المواجهات المباشرة",
    });
  }
};

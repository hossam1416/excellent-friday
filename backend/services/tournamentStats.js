export const calculatePlayerStats = (playerId, matches) => {
  const stats = {
    matchesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
  };

  const playerMatches = matches.filter(
    (match) =>
      !match.isFinalMatch &&
      (match.playerOne.toString() === playerId.toString() ||
        match.playerTwo.toString() === playerId.toString()),
  );

  for (const match of playerMatches) {
    const isPlayerOne = match.playerOne.toString() === playerId.toString();

    const goalsFor = isPlayerOne ? match.scorePlayerOne : match.scorePlayerTwo;

    const goalsAgainst = isPlayerOne
      ? match.scorePlayerTwo
      : match.scorePlayerOne;

    stats.matchesPlayed += 1;
    stats.goalsFor += goalsFor;
    stats.goalsAgainst += goalsAgainst;

    if (goalsFor > goalsAgainst) {
      stats.wins += 1;
      stats.points += 3;
    } else if (goalsFor < goalsAgainst) {
      stats.losses += 1;
    } else {
      stats.draws += 1;
      stats.points += 1;
    }
  }

  stats.goalDifference = stats.goalsFor - stats.goalsAgainst;

  return stats;
};

export const calculateStandings = (players, matches) => {
  const standings = players.map((player) => ({
    player: {
      id: player._id,
      username: player.username,
      avatar: player.avatar,
    },
    ...calculatePlayerStats(player._id, matches),
  }));

  standings.sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor,
  );

  return standings;
};

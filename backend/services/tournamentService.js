import { calculateStandings } from "./tournamentStats.js";

export const getNextMatchup = (matches, players) => {
  if (matches.length === 0) {
    return null;
  }

  const lastMatch = matches[matches.length - 1];

  if (!lastMatch.winner) {
    return null;
  }

  const waitingPlayer = players.find(
    (player) =>
      player.toString() !== lastMatch.playerOne.toString() &&
      player.toString() !== lastMatch.playerTwo.toString(),
  );

  if (!waitingPlayer) {
    return null;
  }

  return [lastMatch.winner, waitingPlayer];
};

export const evaluateTournament = (players, matches) => {
  const mainMatches = matches.filter((match) => !match.isFinalMatch);

  const standings = calculateStandings(players, mainMatches);
  const matchesPlayed = mainMatches.length;
  const remainingMatches = 10 - matchesPlayed;

  if (matchesPlayed >= 10) {
    const first = standings[0];
    const second = standings[1];

    const isTie =
      first.points === second.points &&
      first.goalDifference === second.goalDifference;

    if (isTie) {
      return {
        shouldEnd: false,
        requiresFinalMatch: true,
        endReason: null,
        champion: null,
        standings,
      };
    }

    return {
      shouldEnd: true,
      requiresFinalMatch: false,
      endReason: "max_matches",
      champion: first.player.id,
      standings,
    };
  }

  const leader = standings[0];

  const hasClinched = standings
    .slice(1)
    .every((player) => leader.points > player.points + remainingMatches * 3);

  if (hasClinched) {
    return {
      shouldEnd: true,
      requiresFinalMatch: false,
      endReason: "clinched",
      champion: leader.player.id,
      standings,
    };
  }

  return {
    shouldEnd: false,
    requiresFinalMatch: false,
    endReason: null,
    champion: null,
    standings,
  };
};

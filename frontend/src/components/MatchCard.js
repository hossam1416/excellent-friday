import { Box, Typography } from "@mui/material";
import { getPlayer } from "@/lib/players";
import { colors, displayFont } from "@/lib/theme";

// Renders an individual match card displaying players, scores, and winner highlights
export default function MatchCard({ match }) {
  const winnerId = match.winner?._id;
  const winnerName = getPlayer(match.winner?.username).name;
  const p1Won = match.scorePlayerOne > match.scorePlayerTwo;
  const p2Won = match.scorePlayerTwo > match.scorePlayerOne;

  const nameStyle = (player) =>
    player._id === winnerId
      ? { fontWeight: 700, color: colors.ink }
      : { color: colors.muted };

  const scoreStyle = (won) => ({
    fontFamily: displayFont,
    fontWeight: 800,
    fontSize: 26,
    color: won ? colors.ink : colors.muted,
  });

  return (
    <Box
      sx={{
        border: `1px solid ${colors.line}`,
        borderInlineStart: `6px solid ${getPlayer(match.winner?.username).color}`,
        borderRadius: "20px",
        px: 2,
        py: 1.75,
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
      }}
    >
      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
        {match.label}
        {match.decidedByPenalties && ` · ركلات الترجيح لصالح ${winnerName}`}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        <Typography sx={{ flex: 1, ...nameStyle(match.playerOne) }}>
          {getPlayer(match.playerOne.username).name}
        </Typography>
        <Typography sx={scoreStyle(p1Won)}>{match.scorePlayerOne}</Typography>
        <Typography sx={{ color: "text.secondary" }}>–</Typography>
        <Typography sx={scoreStyle(p2Won)}>{match.scorePlayerTwo}</Typography>
        <Typography
          sx={{ flex: 1, textAlign: "end", ...nameStyle(match.playerTwo) }}
        >
          {getPlayer(match.playerTwo.username).name}
        </Typography>
      </Box>
    </Box>
  );
}

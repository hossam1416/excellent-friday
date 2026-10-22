import { Box, Typography } from "@mui/material";
import MatchCard from "@/components/MatchCard";

export default function LastMatches({ matches }) {
  const last = matches.slice(-3).reverse();

  if (last.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        animation: "rise 0.6s ease 0.4s both",
      }}
    >
      <Typography variant="h2" sx={{ fontSize: 24, px: 0.5, pb: 0.5 }}>
        آخر المباريات
      </Typography>

      {last.map((match) => (
        <MatchCard key={match._id} match={match} />
      ))}
    </Box>
  );
}

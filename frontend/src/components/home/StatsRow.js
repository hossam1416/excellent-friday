import { Box, Typography } from "@mui/material";
import { colors, displayFont } from "@/lib/theme";

export default function StatsRow({ leaderboard, completedCount }) {
  // كل مباراة بتنحسب للاعبين الاثنين، فنقسم على 2
  const matches =
    leaderboard.reduce((sum, row) => sum + row.matchesPlayed, 0) / 2;
  const goals = leaderboard.reduce((sum, row) => sum + row.goalsFor, 0);

  const stats = [
    { value: completedCount, label: "بطولة منتهية" },
    { value: matches, label: "مباراة لُعبت" },
    { value: goals, label: "هدف سُجّل" },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 1.5,
        animation: "rise 0.6s ease 0.3s both",
      }}
    >
      {stats.map((stat) => (
        <Box
          key={stat.label}
          sx={{
            border: `1px solid ${colors.line}`,
            borderRadius: "22px",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 34,
              lineHeight: 1,
            }}
          >
            {stat.value}
          </Typography>
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            {stat.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

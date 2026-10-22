import { Box, Typography } from "@mui/material";
import PlayerAvatar from "@/components/PlayerAvatar";
import { getPlayer } from "@/lib/players";
import { colors, displayFont } from "@/lib/theme";

export default function TitlesCard({ leaderboard, completedCount }) {
  const rows = [...leaderboard].sort((a, b) => b.titles - a.titles);

  return (
    <Box
      sx={{
        bgcolor: colors.surface,
        borderRadius: "28px",
        p: 3,
        animation: "rise 0.6s ease 0.2s both",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Typography variant="h2" sx={{ fontSize: 24 }}>
          الألقاب
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          من {completedCount} بطولة
        </Typography>
      </Box>

      {rows.map((row) => (
        <Box
          key={row.player.id}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            py: 1.5,
            borderTop: "1px solid #E3E0D8",
          }}
        >
          <PlayerAvatar user={row.player} size={36} />
          <Typography sx={{ width: 84, fontWeight: 600 }}>
            {getPlayer(row.player.username).name}
          </Typography>

          <Box sx={{ flex: 1, display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {Array.from({ length: row.titles }, (_, i) => (
              <Box
                key={i}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: colors.gold,
                }}
              />
            ))}
          </Box>

          <Typography
            sx={{ fontFamily: displayFont, fontWeight: 800, fontSize: 28 }}
          >
            {row.titles}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

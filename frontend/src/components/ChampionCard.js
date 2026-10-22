import { Box, Typography } from "@mui/material";
import PlayerAvatar from "@/components/PlayerAvatar";
import { getPlayer } from "@/lib/players";
import { colors, displayFont } from "@/lib/theme";
import { formatDate, endReasonText, signed } from "@/lib/format";

function Stat({ label, value, number }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
      <Typography sx={{ fontSize: 12, opacity: 0.85 }}>{label}</Typography>
      <Typography
        sx={{
          fontFamily: number ? displayFont : "inherit",
          fontWeight: number ? 700 : 600,
          fontSize: number ? 22 : 15,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function ChampionCard({ tournament, row }) {
  const champion = tournament.champion;
  const player = getPlayer(champion.username);

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "32px",
        color: "#fff",
        p: { xs: 2.75, md: 4.5 },
        display: "flex",
        flexDirection: "column",
        gap: 2.25,
        background: `repeating-linear-gradient(90deg, ${player.color} 0 28px, ${player.dark} 28px 56px)`,
        animation: "rise 0.6s ease both",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          insetInlineEnd: 12,
          bottom: -50,
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: { xs: 190, md: 260 },
          lineHeight: 1,
          color: "rgba(255,255,255,0.1)",
        }}
      >
        {player.letter}
      </Box>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            bgcolor: colors.gold,
            color: colors.ink,
            fontSize: 12,
            fontWeight: 600,
            px: 1.5,
            py: 0.6,
            borderRadius: "999px",
          }}
        >
          البطل الأخير
        </Box>
        <Typography sx={{ fontSize: 13, opacity: 0.9 }}>
          {formatDate(tournament.updatedAt)}
        </Typography>
      </Box>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <PlayerAvatar user={champion} size={72} light />
        <Box>
          <Typography
            sx={{
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: { xs: 50, md: 64 },
              lineHeight: 1,
            }}
          >
            {player.name}
          </Typography>
          <Typography sx={{ fontSize: 14, opacity: 0.92, mt: 0.5 }}>
            بطل {tournament.name}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          gap: { xs: 2.5, md: 4 },
          borderTop: "1px solid rgba(255,255,255,0.28)",
          pt: 1.75,
        }}
      >
        <Stat label="الحسم" value={endReasonText(tournament.endReason)} />
        {row && <Stat label="النقاط" value={row.points} number />}
        {row && (
          <Stat label="الفارق" value={signed(row.goalDifference)} number />
        )}
      </Box>
    </Box>
  );
}

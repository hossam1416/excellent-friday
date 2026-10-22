import { Box, Typography } from "@mui/material";
import PlayerAvatar from "@/components/PlayerAvatar";
import { getPlayer } from "@/lib/players";
import { colors, displayFont } from "@/lib/theme";
import { signed } from "@/lib/format";

// عدد الألقاب بالعربي
function titlesText(count) {
  if (count === 0) return "بدون ألقاب بعد";
  if (count === 1) return "لقب واحد";
  if (count === 2) return "لقبان";
  if (count <= 10) return `${count} ألقاب`;
  return `${count} لقبًا`;
}

// row: سطر من /leaderboard | rank: المركز
export default function LeaderCard({ row, rank }) {
  const player = getPlayer(row.player.username);

  // الأول بلون قميصه (بشرط إنه لعب)
  const isLeader = rank === 1 && row.matchesPlayed > 0;
  const mutedColor = isLeader ? "rgba(255,255,255,0.85)" : colors.muted;
  const lineColor = isLeader ? "rgba(255,255,255,0.28)" : colors.line;

  const winRate = row.matchesPlayed
    ? Math.round((row.wins * 100) / row.matchesPlayed)
    : 0;

  const stats = [
    { label: "فوز", value: row.wins },
    { label: "تعادل", value: row.draws },
    { label: "خسارة", value: row.losses },
    { label: "أهداف له", value: row.goalsFor },
    { label: "أهداف عليه", value: row.goalsAgainst },
    { label: "الفارق", value: signed(row.goalDifference) },
  ];
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "28px",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        color: isLeader ? "#fff" : colors.ink,
        border: isLeader ? "none" : `1px solid ${colors.line}`,
        background: isLeader
          ? `repeating-linear-gradient(90deg, ${player.color} 0 28px, ${player.dark} 28px 56px)`
          : "#fff",
        animation: `rise 0.6s ease ${rank * 0.1}s both`,
      }}
    >
      {/* رقم المركز باهت بالخلفية */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          insetInlineEnd: 16,
          bottom: -30,
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 150,
          lineHeight: 1,
          color: isLeader ? "rgba(255,255,255,0.12)" : "rgba(20,22,26,0.05)",
        }}
      >
        {rank}
      </Box>

      {/* الاسم والنقاط */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 1.75,
        }}
      >
        <PlayerAvatar user={row.player} size={56} light={isLeader} />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 32,
              lineHeight: 1.1,
            }}
          >
            {player.name}
          </Typography>
          <Typography sx={{ fontSize: 13, color: mutedColor }}>
            المركز {rank}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "end" }}>
          <Typography
            sx={{
              fontFamily: displayFont,
              fontWeight: 600,
              fontSize: 38,
              lineHeight: 0.9,
            }}
          >
            {row.points}
          </Typography>
          <Typography sx={{ fontSize: 12, color: mutedColor }}>نقطة</Typography>
        </Box>
      </Box>

      {/* الألقاب: نقطة ذهبية لكل لقب */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
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
        <Typography sx={{ fontSize: 13, color: mutedColor }}>
          {titlesText(row.titles)}
        </Typography>
      </Box>

      {/* الأرقام */}
      <Box
        sx={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          columnGap: 1,
          rowGap: 2,
          borderTop: `1px solid ${lineColor}`,
          pt: 2,
        }}
      >
        {stats.map((stat) => (
          <Box key={stat.label}>
            <Typography sx={{ fontSize: 12, color: mutedColor }}>
              {stat.label}
            </Typography>
            <Typography
              sx={{ fontFamily: displayFont, fontWeight: 700, fontSize: 22 }}
            >
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography
        sx={{ position: "relative", fontSize: 13, color: mutedColor }}
      >
        {row.matchesPlayed} مباراة · نسبة الفوز {winRate}% ·{" "}
        {row.tournamentsPlayed} بطولة
      </Typography>
    </Box>
  );
}

import { Box, Typography } from "@mui/material";
import Matchup from "@/components/Matchup";
import { colors } from "@/lib/theme";

// tournament: البطولة | info: رد /standings
export default function NextMatchBox({ tournament, info }) {
  // المباراة الفاصلة مطلوبة
  if (info.requiresFinalMatch) {
    return (
      <Box
        sx={{
          border: `2px solid ${colors.gold}`,
          borderRadius: "22px",
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
          تعادل في القمة، لازم مباراة فاصلة
        </Typography>
        <Matchup a={info.finalMatchPlayers[0]} b={info.finalMatchPlayers[1]} />
      </Box>
    );
  }

  // المواجهة العادية: نلاقي اللاعبين من أرقامهم
  const next = info.nextMatchup?.map((id) =>
    tournament.players.find((player) => player._id === id),
  );
  const hasNext = next && next.every(Boolean);

  return (
    <Box
      sx={{
        border: `1px solid ${colors.line}`,
        borderRadius: "22px",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          color: "text.secondary",
        }}
      >
        <span>المواجهة القادمة</span>
        <span>المباراة {info.mainMatchesPlayed + 1}</span>
      </Box>

      {hasNext ? (
        <Matchup a={next[0]} b={next[1]} />
      ) : (
        <Typography sx={{ color: "text.secondary" }}>
          المباراة الأولى: الأدمن بيختار اللاعبين.
        </Typography>
      )}
    </Box>
  );
}

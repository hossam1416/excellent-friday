import { Box, Typography } from "@mui/material";
import PlayerAvatar from "./PlayerAvatar";
import { getPlayer } from "@/lib/players";
import { displayFont } from "@/lib/theme";

function Side({ user }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <PlayerAvatar user={user} size={56} />
      <Typography
        sx={{ fontFamily: displayFont, fontWeight: 700, fontSize: 22 }}
      >
        {getPlayer(user.username).name}
      </Typography>
    </Box>
  );
}

export default function Matchup({ a, b }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        gap: 1,
      }}
    >
      <Side user={a} />
      <Typography sx={{ fontSize: 14, color: "text.secondary" }}>ضد</Typography>
      <Side user={b} />
    </Box>
  );
}

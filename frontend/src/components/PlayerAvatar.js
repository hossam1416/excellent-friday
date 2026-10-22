import { Box } from "@mui/material";
import { getPlayer } from "@/lib/players";
import { colors, displayFont } from "@/lib/theme";

export default function PlayerAvatar({ user, size = 40, light = false }) {
  const player = getPlayer(user?.username);
  const ring = light ? `0 0 0 3px ${colors.gold}` : `0 0 0 2px ${player.color}`;

  if (user?.avatar) {
    return (
      <Box
        component="img"
        src={user.avatar}
        alt={player.name}
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
          boxShadow: ring,
        }}
      />
    );
  }

  const step = size / 6;
  const first = light ? "#ffffff" : player.color;
  const second = light ? "#EFEFEF" : player.dark;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: `repeating-linear-gradient(90deg, ${first} 0 ${step}px, ${second} ${step}px ${step * 2}px)`,
        color: light ? player.color : "#fff",
        boxShadow: light ? ring : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: displayFont,
        fontWeight: 700,
        fontSize: size * 0.45,
      }}
    >
      {player.letter}
    </Box>
  );
}

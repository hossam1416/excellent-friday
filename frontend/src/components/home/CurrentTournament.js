import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import PlayerAvatar from "@/components/PlayerAvatar";
import MatchStrip from "@/components/MatchStrip";
import Matchup from "@/components/Matchup";
import { getPlayer } from "@/lib/players";
import { colors, displayFont } from "@/lib/theme";
import { signed } from "@/lib/format";

export default function CurrentTournament({
  tournament,
  info,
  matches,
  isAdmin,
}) {
  const mainMatches = matches.filter((match) => !match.isFinalMatch);
  const played = info.mainMatchesPlayed;

  const next = info.nextMatchup?.map((id) =>
    tournament.players.find((player) => player._id === id),
  );
  const hasNext = next && next.every(Boolean);

  const buttonText = info.requiresFinalMatch
    ? "تسجيل المباراة الفاصلة"
    : `تسجيل نتيجة المباراة ${played + 1}`;

  return (
    <Box
      sx={{
        border: `1px solid ${colors.line}`,
        borderRadius: "32px",
        p: { xs: 2.5, md: 4.5 },
        display: "flex",
        flexDirection: "column",
        gap: 3,
        animation: "rise 0.6s ease 0.1s both",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: colors.red,
                animation: "pulse 1.6s ease-in-out infinite",
              }}
            />
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              البطولة الجارية
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{ fontSize: { xs: 28, md: 36 }, lineHeight: 1.15 }}
          >
            {tournament.name}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.25 }}>
          <Typography
            sx={{
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: { xs: 72, md: 84 },
              lineHeight: 0.9,
            }}
          >
            {played}
          </Typography>
          <Typography
            sx={{
              fontFamily: displayFont,
              fontSize: 28,
              color: "text.secondary",
            }}
          >
            / 10
          </Typography>
        </Box>
      </Box>

      <MatchStrip matches={mainMatches} />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          fontSize: 12,
          color: "text.secondary",
        }}
      >
        {tournament.players.map((player) => (
          <Box
            key={player._id}
            sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
          >
            <Box
              sx={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                bgcolor: getPlayer(player.username).color,
              }}
            />
            {getPlayer(player.username).name}
          </Box>
        ))}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: colors.ink,
            }}
          />
          انحسمت بالركلات
        </Box>
      </Box>

      <Box>
        <Typography sx={{ fontSize: 13, color: "text.secondary", pb: 0.75 }}>
          الترتيب الآن
        </Typography>
        {info.standings.map((row, i) => (
          <Box
            key={row.player.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.75,
              py: 1.25,
              borderTop: `1px solid ${colors.line}`,
            }}
          >
            <Typography
              sx={{
                width: 20,
                fontFamily: displayFont,
                fontWeight: 700,
                fontSize: 20,
                color: i === 0 ? colors.ink : colors.muted,
              }}
            >
              {i + 1}
            </Typography>
            <PlayerAvatar user={row.player} size={40} />
            <Typography sx={{ flex: 1, fontWeight: 600, fontSize: 18 }}>
              {getPlayer(row.player.username).name}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              فارق {signed(row.goalDifference)}
            </Typography>
            <Typography
              sx={{
                width: 40,
                textAlign: "end",
                fontFamily: displayFont,
                fontWeight: 800,
                fontSize: 28,
              }}
            >
              {row.points}
            </Typography>
          </Box>
        ))}
      </Box>

      {info.requiresFinalMatch ? (
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
          <Matchup
            a={info.finalMatchPlayers[0]}
            b={info.finalMatchPlayers[1]}
          />
        </Box>
      ) : (
        <Box
          sx={{
            bgcolor: colors.surface,
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
            <span>المباراة {played + 1}</span>
          </Box>

          {hasNext ? (
            <Matchup a={next[0]} b={next[1]} />
          ) : (
            <Typography sx={{ color: "text.secondary" }}>
              المباراة الأولى: الأدمن بيختار اللاعبين.
            </Typography>
          )}
        </Box>
      )}

      {isAdmin && (
        <Button
          component={Link}
          href={`/tournaments/${tournament._id}`}
          variant="contained"
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
}

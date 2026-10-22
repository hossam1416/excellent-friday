import { Box, Typography } from "@mui/material";
import PlayerAvatar from "@/components/PlayerAvatar";
import { getPlayer } from "@/lib/players";
import { colors, displayFont } from "@/lib/theme";

// اللاعب (أو اللاعبين) صاحب أعلى قيمة، أو أقل قيمة لو lowest
function findWinners(rows, getValue, lowest = false) {
  const values = rows.map(getValue);
  const best = lowest ? Math.min(...values) : Math.max(...values);

  // الكل متساوي: ما في فائز
  if (values.every((value) => value === best)) return [];

  return rows.filter((row) => getValue(row) === best);
}

export default function AwardsCard({ leaderboard }) {
  // اللي لعب مباريات فقط
  const rows = leaderboard.filter((row) => row.matchesPlayed > 0);

  if (rows.length === 0) return null;

  // معدل الأهداف بالمباراة
  const attack = (row) => row.goalsFor / row.matchesPlayed;
  const defense = (row) => row.goalsAgainst / row.matchesPlayed;

  const awards = [
    {
      label: "أقوى هجوم",
      winners: findWinners(rows, attack),
      value: (row) => attack(row).toFixed(1),
      unit: "هدف بالمباراة",
      note: (row) => `${row.goalsFor} هدف من ${row.matchesPlayed} مباراة`,
    },
    {
      label: "أقوى دفاع",
      winners: findWinners(rows, defense, true),
      value: (row) => defense(row).toFixed(1),
      unit: "هدف عليه بالمباراة",
      note: (row) => `${row.goalsAgainst} هدف من ${row.matchesPlayed} مباراة`,
    },
    {
      label: "الأكثر فوزًا",
      winners: findWinners(rows, (row) => row.wins),
      value: (row) => row.wins,
      unit: "فوز",
      note: (row) =>
        `نسبة الفوز ${Math.round((row.wins * 100) / row.matchesPlayed)}%`,
    },
    {
      label: "الأكثر خسارة",
      winners: findWinners(rows, (row) => row.losses),
      value: (row) => row.losses,
      unit: "خسارة",
      note: (row) => `من ${row.matchesPlayed} مباراة`,
    },
  ];

  return (
    <Box sx={{ animation: "rise 0.6s ease 0.2s both" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          mb: 1.5,
          px: 0.5,
        }}
      >
        <Typography variant="h2" sx={{ fontSize: { xs: 22, md: 26 } }}>
          أبرز الأرقام
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          من البطولات المنتهية
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 1.5,
        }}
      >
        {awards.map((award) => {
          const first = award.winners[0];
          const single = award.winners.length === 1;

          return (
            <Box
              key={award.label}
              sx={{
                border: `1px solid ${colors.line}`,
                // لون الفائز على الحافة (لو في فائز واحد)
                borderInlineStart: `5px solid ${single ? getPlayer(first.player.username).color : colors.line}`,
                borderRadius: "22px",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                {award.label}
              </Typography>

              {first ? (
                <>
                  {/* الفائز أو الفائزين */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    {award.winners.map((row) => (
                      <Box
                        key={row.player.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                        }}
                      >
                        <PlayerAvatar user={row.player} size={28} />
                        <Typography
                          sx={{
                            fontFamily: displayFont,
                            fontWeight: 700,
                            fontSize: 20,
                          }}
                        >
                          {getPlayer(row.player.username).name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontFamily: displayFont,
                        fontWeight: 800,
                        fontSize: 30,
                        lineHeight: 1,
                      }}
                    >
                      {award.value(first)}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}
                    >
                      {award.unit}
                    </Typography>
                  </Box>

                  {single && (
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                      {award.note(first)}
                    </Typography>
                  )}
                </>
              ) : (
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                  لسا ما في فرق بين اللاعبين
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

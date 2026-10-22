import { Box, Typography } from "@mui/material";
import PlayerAvatar from "@/components/PlayerAvatar";
import { getPlayer } from "@/lib/players";
import { colors, displayFont } from "@/lib/theme";

// صورة اللاعب واسمه (reverse: الصورة على الطرف الثاني)
function Side({ player, reverse }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexDirection: reverse ? "row-reverse" : "row",
      }}
    >
      <PlayerAvatar user={player} size={32} />
      <Typography
        sx={{ fontFamily: displayFont, fontWeight: 700, fontSize: 20 }}
      >
        {getPlayer(player.username).name}
      </Typography>
    </Box>
  );
}

// pairs: رد /leaderboard/head-to-head
export default function HeadToHeadCard({ pairs }) {
  return (
    <Box
      sx={{
        border: `1px solid ${colors.line}`,
        borderRadius: "28px",
        p: 3,
        animation: "rise 0.6s ease 0.3s both",
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
        <Typography variant="h2" sx={{ fontSize: { xs: 22, md: 26 } }}>
          المواجهات المباشرة
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          من البطولات المنتهية
        </Typography>
      </Box>

      {pairs.map((pair, i) => {
        // الشريط: فوز الأول، التعادل، فوز الثاني
        const segments = [
          {
            value: pair.winsOne,
            color: getPlayer(pair.playerOne.username).color,
          },
          { value: pair.draws, color: "#D9D6CF" },
          {
            value: pair.winsTwo,
            color: getPlayer(pair.playerTwo.username).color,
          },
        ];

        return (
          <Box
            key={`${pair.playerOne.id}-${pair.playerTwo.id}`}
            sx={{
              py: 2,
              borderTop: i === 0 ? "none" : `1px solid ${colors.line}`,
              display: "flex",
              flexDirection: "column",
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Side player={pair.playerOne} />
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                {pair.matches} مباراة
              </Typography>
              <Side player={pair.playerTwo} reverse />
            </Box>

            {pair.matches === 0 ? (
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                ما التقوا بعد
              </Typography>
            ) : (
              <>
                {/* الشريط بنسبة الفوز */}
                <Box sx={{ display: "flex", gap: "3px", height: 12 }}>
                  {segments
                    .filter((segment) => segment.value > 0)
                    .map((segment, index) => (
                      <Box
                        key={index}
                        sx={{
                          flex: segment.value,
                          bgcolor: segment.color,
                          borderRadius: "6px",
                        }}
                      />
                    ))}
                </Box>

                {/* الفوز وبينهم التعادل */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: displayFont,
                      fontWeight: 800,
                      fontSize: 28,
                    }}
                  >
                    {pair.winsOne}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    تعادل {pair.draws}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: displayFont,
                      fontWeight: 800,
                      fontSize: 28,
                    }}
                  >
                    {pair.winsTwo}
                  </Typography>
                </Box>

                {/* الأهداف */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "text.secondary",
                  }}
                >
                  <span>{pair.goalsOne} هدف</span>
                  <span>{pair.goalsTwo} هدف</span>
                </Box>
              </>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

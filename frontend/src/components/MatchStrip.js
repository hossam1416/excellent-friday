import { Box } from "@mui/material";
import { colors, displayFont } from "@/lib/theme";
import { getPlayer } from "@/lib/players";

// Renders a 10-match progress strip showing match results and upcoming slots
export default function MatchStrip({ matches, active = true, height = 38 }) {
  const cells = Array.from({ length: 10 }, (_, i) => matches[i]);

  return (
    <Box>
      <Box sx={{ display: "flex", gap: "4px", height }}>
        {cells.map((match, i) => {
          if (match) {
            return (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  borderRadius: "8px",
                  bgcolor: getPlayer(match.winner?.username).color,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  pb: "5px",
                  transformOrigin: "bottom",
                  animation: `grow 0.5s ease ${i * 0.07}s both`,
                }}
              >
                {match.decidedByPenalties && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#fff",
                    }}
                  />
                )}
              </Box>
            );
          }

          const isNext = active && i === matches.length;

          return (
            <Box
              key={i}
              sx={{
                flex: 1,
                borderRadius: "8px",
                boxSizing: "border-box",
                border: isNext
                  ? `2px dashed ${colors.ink}`
                  : "1.5px dashed #D9D6CF",
              }}
            />
          );
        })}
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: "4px",
          mt: 0.75,
          fontFamily: displayFont,
          fontSize: 11,
          color: colors.muted,
          textAlign: "center",
        }}
      >
        {cells.map((_, i) => (
          <Box
            key={i}
            sx={{
              flex: 1,
              ...(active &&
                i === matches.length && { color: colors.ink, fontWeight: 700 }),
            }}
          >
            {i + 1}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

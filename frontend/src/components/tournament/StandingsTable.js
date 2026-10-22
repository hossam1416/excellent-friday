import { Box } from "@mui/material";
import { getPlayer } from "@/lib/players";
import { colors, displayFont } from "@/lib/theme";
import { signed } from "@/lib/format";

// desktopOnly: العمود بيظهر على اللابتوب فقط
const columns = [
  { key: "matchesPlayed", label: "م" },
  { key: "wins", label: "ف" },
  { key: "draws", label: "ت" },
  { key: "losses", label: "خ" },
  { key: "goalsFor", label: "له" },
  { key: "goalsAgainst", label: "عليه" },
  { key: "goalDifference", label: "فارق" },
  { key: "points", label: "نقاط" },
];

const gridColumns = {
  xs: "minmax(0, 1fr) repeat(8, 28px)",
  md: "minmax(0, 1.8fr) repeat(8, minmax(0, 1fr))",
};

// الأعمدة المخفية بالموبايل
const cellDisplay = (column) =>
  column.desktopOnly ? { xs: "none", md: "block" } : "block";

export default function StandingsTable({ standings }) {
  return (
    <Box
      sx={{
        bgcolor: colors.surface,
        borderRadius: "28px",
        px: { xs: 2, md: 3.5 },
        py: { xs: 2.5, md: 3 },
        animation: "rise 0.6s ease 0.1s both",
      }}
    >
      <Box
        component="h2"
        sx={{
          m: 0,
          mb: 1.5,
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: { xs: 22, md: 26 },
        }}
      >
        الترتيب
      </Box>

      {/* عناوين الأعمدة */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: gridColumns,
          alignItems: "center",
          px: 0.5,
          pb: 1.25,
          fontSize: { xs: 12, md: 13 },
          color: colors.muted,
          textAlign: "center",
        }}
      >
        <Box sx={{ textAlign: "start" }}>اللاعب</Box>
        {columns.map((column) => (
          <Box key={column.key} sx={{ display: cellDisplay(column) }}>
            {column.label}
          </Box>
        ))}
      </Box>

      {/* سطر لكل لاعب */}
      {standings.map((row) => {
        const player = getPlayer(row.player.username);

        return (
          <Box
            key={row.player.id}
            sx={{
              display: "grid",
              gridTemplateColumns: gridColumns,
              alignItems: "center",
              px: 0.5,
              py: { xs: 1.4, md: 1.75 },
              borderTop: "1px solid #E3E0D8",
              textAlign: "center",
              fontFamily: displayFont,
              fontSize: { xs: 16, md: 19 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textAlign: "start",
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 26,
                  borderRadius: "2px",
                  bgcolor: player.color,
                  flexShrink: 0,
                }}
              />
              <Box
                sx={{
                  fontFamily: "var(--font-plex), sans-serif",
                  fontWeight: 600,
                  fontSize: { xs: 15, md: 18 },
                }}
              >
                {player.name}
              </Box>
            </Box>

            {columns.map((column) => (
              <Box
                key={column.key}
                sx={{
                  display: cellDisplay(column),
                  ...(column.key === "points" && {
                    fontWeight: 800,
                    fontSize: { xs: 20, md: 28 },
                  }),
                }}
              >
                {column.key === "goalDifference"
                  ? signed(row.goalDifference)
                  : row[column.key]}
              </Box>
            ))}
          </Box>
        );
      })}

      <Box sx={{ mt: 1.5, fontSize: 12, color: colors.muted }}>
        م مباريات · ف فوز · ت تعادل · خ خسارة · الترتيب بالنقاط ثم الفارق
      </Box>
    </Box>
  );
}

import { Box, Typography, Button } from "@mui/material";
import { colors } from "@/lib/theme";

export default function NoActiveCard({
  pending,
  isAdmin,
  busy,
  onCreate,
  onStart,
}) {
  return (
    <Box
      sx={{
        border: `1px solid ${colors.line}`,
        borderRadius: "32px",
        p: { xs: 2.5, md: 4.5 },
        display: "flex",
        flexDirection: "column",
        gap: 2,
        animation: "rise 0.6s ease 0.1s both",
      }}
    >
      {pending ? (
        <>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            بطولة جاهزة للبدء
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 36 } }}>
            {pending.name}
          </Typography>

          {isAdmin ? (
            <Button variant="contained" onClick={onStart} disabled={busy}>
              {busy ? "جاري البدء..." : "بدء البطولة"}
            </Button>
          ) : (
            <Typography sx={{ color: "text.secondary" }}>
              بانتظار الأدمن يبدأ البطولة.
            </Typography>
          )}
        </>
      ) : (
        <>
          <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 36 } }}>
            ما في بطولة جارية الآن
          </Typography>

          {isAdmin ? (
            <Button variant="contained" onClick={onCreate}>
              إنشاء بطولة
            </Button>
          ) : (
            <Typography sx={{ color: "text.secondary" }}>
              بانتظار الجمعة الجاية.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}

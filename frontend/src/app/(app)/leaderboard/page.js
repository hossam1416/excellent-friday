"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { api } from "@/lib/api";
import LeaderCard from "@/components/leaderboard/LeaderCard";

export default function LeaderboardPage() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/leaderboard")
      .then((res) => setRows(res.leaderboard))
      .catch((err) => setError(err.message));
  }, []);

  if (!rows) {
    return error ? (
      <Alert severity="error">{error}</Alert>
    ) : (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  // عدد البطولات المنتهية
  const completedCount = Math.max(
    0,
    ...rows.map((row) => row.tournamentsPlayed),
  );

  return (
    <>
      <Box sx={{ mb: 3.5 }}>
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: 44, md: 60 }, lineHeight: 1.1 }}
        >
          الترتيب العام
        </Typography>
        <Typography sx={{ color: "text.secondary", mt: 1 }}>
          من {completedCount} بطولة منتهية
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "repeat(3, minmax(0, 1fr))",
          },
        }}
      >
        {rows.map((row, i) => (
          <LeaderCard key={row.player.id} row={row} rank={i + 1} />
        ))}
      </Box>

      <Typography sx={{ mt: 3, fontSize: 13, color: "text.secondary" }}>
        الأرقام من البطولات المنتهية فقط، والمباراة الفاصلة ما بتنحسب فيها.
      </Typography>
    </>
  );
}

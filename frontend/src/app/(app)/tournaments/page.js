"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { getPlayer } from "@/lib/players";
import { colors, displayFont } from "@/lib/theme";
import { formatDate, statusText } from "@/lib/format";
import PlayerAvatar from "@/components/PlayerAvatar";
import CreateTournamentDialog from "@/components/tournament/CreateTournamentDialog";

export default function TournamentsPage() {
  const { isAdmin } = useAuth();
  const [tournaments, setTournaments] = useState(null);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    api("/tournaments")
      .then((res) => setTournaments(res.tournaments))
      .catch((err) => setError(err.message));
  }, []);

  // نعيد التحميل بعد إنشاء بطولة
  const reload = () =>
    api("/tournaments")
      .then((res) => setTournaments(res.tournaments))
      .catch((err) => setError(err.message));

  if (!tournaments) {
    return error ? (
      <Alert severity="error">{error}</Alert>
    ) : (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 3.5,
        }}
      >
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: 44, md: 60 }, lineHeight: 1.1 }}
        >
          البطولات
        </Typography>

        {isAdmin && (
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            إنشاء بطولة
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {tournaments.length === 0 && (
        <Typography sx={{ color: "text.secondary" }}>
          ما في بطولات بعد.
        </Typography>
      )}

      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        }}
      >
        {tournaments.map((tournament) => {
          const champion = tournament.champion;

          return (
            <Box
              key={tournament._id}
              component={Link}
              href={`/tournaments/${tournament._id}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2.5,
                borderRadius: "22px",
                border: `1px solid ${colors.line}`,
                borderInlineStart: `6px solid ${champion ? getPlayer(champion.username).color : colors.line}`,
                color: "inherit",
                textDecoration: "none",
                transition: "background-color 0.25s",
                "&:hover": { bgcolor: colors.surface },
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: displayFont,
                    fontWeight: 700,
                    fontSize: 22,
                  }}
                >
                  {tournament.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color:
                      tournament.status === "active"
                        ? colors.red
                        : "text.secondary",
                  }}
                >
                  {statusText(tournament.status)} ·{" "}
                  {formatDate(tournament.createdAt)}
                </Typography>
              </Box>

              {tournament.status === "completed" &&
                (champion ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PlayerAvatar user={champion} size={36} />
                    <Typography sx={{ fontWeight: 600 }}>
                      {getPlayer(champion.username).name}
                    </Typography>
                  </Box>
                ) : (
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    بدون بطل
                  </Typography>
                ))}
            </Box>
          );
        })}
      </Box>

      <CreateTournamentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={() => {
          setDialogOpen(false);
          reload();
        }}
      />
    </>
  );
}

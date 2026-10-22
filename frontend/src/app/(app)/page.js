"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { getPlayer } from "@/lib/players";
import { colors } from "@/lib/theme";
import { numberMatches } from "@/lib/format";
// components
import ChampionCard from "@/components/ChampionCard";
import CurrentTournament from "@/components/home/CurrentTournament";
import NoActiveCard from "@/components/home/NoActiveCard";
import TitlesCard from "@/components/home/TitlesCard";
import StatsRow from "@/components/home/StatsRow";
import LastMatches from "@/components/home/LastMatches";
import CreateTournamentDialog from "@/components/tournament/CreateTournamentDialog";
import AwardsCard from "@/components/home/AwardsCard";
import HeadToHeadCard from "@/components/home/HeadToHeadCard";
// Fetches all necessary dashboard data concurrently
async function loadHomeData() {
  const [tournamentsRes, leaderboardRes, headToHeadRes] = await Promise.all([
    api("/tournaments"),
    api("/leaderboard"),
    api("/leaderboard/head-to-head"),
  ]);

  const tournaments = tournamentsRes.tournaments; // Latest first
  const active = tournaments.find((t) => t.status === "active");
  const pending = tournaments.find((t) => t.status === "pending");
  const completed = tournaments.filter((t) => t.status === "completed");
  const lastChampion = completed.find((t) => t.champion);

  // Matches for the active tournament or the latest completed one
  const matchesSource = active || completed[0];

  const [activeInfo, matchesRes, championInfo] = await Promise.all([
    active ? api(`/tournaments/${active._id}/standings`) : null,
    matchesSource ? api(`/matches/tournament/${matchesSource._id}`) : null,
    lastChampion ? api(`/tournaments/${lastChampion._id}/standings`) : null,
  ]);

  // Reverse backend order to chronological and number matches
  const matches = numberMatches(
    matchesRes ? [...matchesRes.matches].reverse() : [],
  );

  const championRow = championInfo?.standings.find(
    (row) => row.player.id === lastChampion.champion._id,
  );

  return {
    active,
    pending,
    lastChampion,
    championRow,
    activeInfo,
    matches,
    leaderboard: leaderboardRes.leaderboard,
    headToHead: headToHeadRes.headToHead,
    completedCount: completed.length,
  };
}

export default function HomePage() {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadHomeData()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  const reload = () =>
    loadHomeData()
      .then((result) => {
        setData(result);
        setError("");
      })
      .catch((err) => setError(err.message));

  const handleStart = async () => {
    setBusy(true);

    try {
      await api(`/tournaments/${data.pending._id}/start`, { method: "PATCH" });
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!data) {
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
      {/* Header section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 3.5,
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: 44, md: 60 }, lineHeight: 1.1 }}
          >
            الجمعة الممتازة
          </Typography>
          <Box sx={{ display: "flex", gap: "4px", mt: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 6,
                borderRadius: "3px",
                bgcolor: colors.red,
              }}
            />
            <Box
              sx={{
                width: 28,
                height: 6,
                borderRadius: "3px",
                bgcolor: colors.burgundy,
              }}
            />
            <Box
              sx={{
                width: 16,
                height: 6,
                borderRadius: "3px",
                bgcolor: colors.blue,
              }}
            />
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          alignItems: "flex-start",
        }}
      >
        {/* Main content column */}
        <Box
          sx={{
            flex: "999 1 640px",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {data.lastChampion && (
            <ChampionCard
              tournament={data.lastChampion}
              row={data.championRow}
            />
          )}

          {data.active ? (
            <CurrentTournament
              tournament={data.active}
              info={data.activeInfo}
              matches={data.matches}
              isAdmin={isAdmin}
            />
          ) : (
            <NoActiveCard
              pending={data.pending}
              isAdmin={isAdmin}
              busy={busy}
              onCreate={() => setDialogOpen(true)}
              onStart={handleStart}
            />
          )}
          <AwardsCard leaderboard={data.leaderboard} />
          <HeadToHeadCard pairs={data.headToHead} />
        </Box>

        {/* Sidebar column */}
        <Box
          sx={{
            flex: "1 1 340px",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TitlesCard
            leaderboard={data.leaderboard}
            completedCount={data.completedCount}
          />
          <StatsRow
            leaderboard={data.leaderboard}
            completedCount={data.completedCount}
          />
          <LastMatches matches={data.matches} />
        </Box>
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

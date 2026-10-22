"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
import { formatDate, statusText, numberMatches } from "@/lib/format";
// components
import ChampionCard from "@/components/ChampionCard";
import StandingsTable from "@/components/tournament/StandingsTable";
import NextMatchBox from "@/components/tournament/NextMatchBox";
import RecordMatchDialog from "@/components/tournament/RecordMatchDialog";
import EndTournamentDialog from "@/components/tournament/EndTournamentDialog";
import MatchStrip from "@/components/MatchStrip";
import MatchCard from "@/components/MatchCard";
// نجيب بيانات البطولة كلها
async function loadTournament(id) {
  const [tournamentRes, info, matchesRes] = await Promise.all([
    api(`/tournaments/${id}`),
    api(`/tournaments/${id}/standings`),
    api(`/matches/tournament/${id}`),
  ]);

  return {
    tournament: tournamentRes.tournament,
    info,
    // الباك إند بيرجعها الأحدث أولًا، فنعكسها ونرقّمها
    matches: numberMatches([...matchesRes.matches].reverse()),
  };
}

export default function TournamentPage() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState(null); // "record" | "edit" | "end"
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadTournament(id)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [id]);

  // نعيد التحميل بعد أي تعديل
  const reload = () =>
    loadTournament(id)
      .then((result) => {
        setData(result);
        setError("");
      })
      .catch((err) => setError(err.message));

  const closeAndReload = () => {
    setDialog(null);
    reload();
  };

  const handleStart = async () => {
    setBusy(true);

    try {
      await api(`/tournaments/${id}/start`, { method: "PATCH" });
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  // لسا بنحمّل
  if (!data) {
    return error ? (
      <>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button component={Link} href="/tournaments">
          كل البطولات
        </Button>
      </>
    ) : (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const { tournament, info, matches } = data;
  const mainMatches = matches.filter((match) => !match.isFinalMatch);
  const lastMatch = matches[matches.length - 1];
  const isPending = tournament.status === "pending";
  const isActive = tournament.status === "active";
  const isCompleted = tournament.status === "completed";

  // البطولة المنتهية يدويًا ما بتنعدّل
  const canEditLast = Boolean(lastMatch) && tournament.endReason !== "manual";
  const showSide = isActive || (isAdmin && (isPending || canEditLast));

  // سطر البطل من الترتيب
  const championRow = info.standings.find(
    (row) => row.player.id === tournament.champion?._id,
  );

  const recordText = info.requiresFinalMatch
    ? "تسجيل المباراة الفاصلة"
    : `تسجيل نتيجة المباراة ${info.mainMatchesPlayed + 1}`;

  // مكان كل قسم بالصفحة
  const areas = showSide
    ? { xs: '"table" "side" "matches"', md: '"table side" "matches side"' }
    : { xs: '"table" "matches"' };

  return (
    <>
      {/* الرأس */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            component={Link}
            href="/tournaments"
            sx={{
              fontSize: 14,
              color: "text.secondary",
              textDecoration: "none",
            }}
          >
            ‹ كل البطولات
          </Typography>
          <Typography
            sx={{
              mt: 1.5,
              fontSize: 14,
              color: isActive ? colors.red : "text.secondary",
            }}
          >
            {statusText(tournament.status)} · أُنشئت{" "}
            {formatDate(tournament.createdAt)}
          </Typography>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: 40, md: 60 }, lineHeight: 1.1 }}
          >
            {tournament.name}
          </Typography>
        </Box>

        {!isPending && (
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.25 }}>
            <Typography
              sx={{
                fontFamily: displayFont,
                fontWeight: 800,
                fontSize: { xs: 64, md: 96 },
                lineHeight: 0.9,
              }}
            >
              {info.mainMatchesPlayed}
            </Typography>
            <Typography
              sx={{
                fontFamily: displayFont,
                fontSize: { xs: 26, md: 36 },
                color: "text.secondary",
              }}
            >
              / 10
            </Typography>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* شريط المباريات */}
        {!isPending && (
          <Box
            sx={{
              border: `1px solid ${colors.line}`,
              borderRadius: "28px",
              p: { xs: 2.5, md: 3.5 },
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <MatchStrip matches={mainMatches} active={isActive} height={48} />

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
          </Box>
        )}

        {/* البطل */}
        {isCompleted && tournament.champion && (
          <ChampionCard
            tournament={tournament}
            row={championRow}
            label="البطل"
          />
        )}
        {isCompleted && !tournament.champion && (
          <Typography sx={{ color: "text.secondary" }}>
            انتهت هالبطولة بدون بطل.
          </Typography>
        )}

        <Box
          sx={{
            display: "grid",
            gap: 3,
            alignItems: "start",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: showSide ? "minmax(0, 1fr) 360px" : "minmax(0, 1fr)",
            },
            gridTemplateAreas: areas,
          }}
        >
          {/* الترتيب */}
          <Box sx={{ gridArea: "table" }}>
            {isPending ? (
              <Box sx={{ bgcolor: colors.surface, borderRadius: "28px", p: 3 }}>
                <Typography sx={{ color: "text.secondary" }}>
                  هالبطولة لسا ما بدأت.
                </Typography>
              </Box>
            ) : (
              <StandingsTable standings={info.standings} />
            )}
          </Box>

          {/* المواجهة القادمة وأزرار الأدمن */}
          {showSide && (
            <Box
              sx={{
                gridArea: "side",
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
              }}
            >
              {isActive && <NextMatchBox tournament={tournament} info={info} />}

              {isAdmin && (
                <Box
                  sx={{
                    bgcolor: colors.surface,
                    borderRadius: "28px",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                    إدارة البطولة · للأدمن فقط
                  </Typography>

                  {isPending && (
                    <Button
                      variant="contained"
                      onClick={handleStart}
                      disabled={busy}
                    >
                      {busy ? "جاري البدء..." : "بدء البطولة"}
                    </Button>
                  )}

                  {isActive && (
                    <Button
                      variant="contained"
                      onClick={() => setDialog("record")}
                    >
                      {recordText}
                    </Button>
                  )}

                  {canEditLast && (
                    <Button
                      variant="outlined"
                      onClick={() => setDialog("edit")}
                    >
                      تعديل آخر مباراة
                    </Button>
                  )}

                  {isActive && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => setDialog("end")}
                    >
                      إنهاء البطولة يدويًا
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          )}

          {/* كل المباريات، الأحدث أولًا */}
          {matches.length > 0 && (
            <Box
              sx={{
                gridArea: "matches",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: 22, md: 26 }, px: 0.5 }}
              >
                المباريات
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gap: 1.5,
                  gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    md: "repeat(2, minmax(0, 1fr))",
                  },
                }}
              >
                {[...matches].reverse().map((match) => (
                  <MatchCard key={match._id} match={match} />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* النوافذ */}
      {dialog === "record" && (
        <RecordMatchDialog
          tournament={tournament}
          info={info}
          onClose={() => setDialog(null)}
          onSaved={closeAndReload}
        />
      )}

      {dialog === "edit" && (
        <RecordMatchDialog
          tournament={tournament}
          info={info}
          match={lastMatch}
          onClose={() => setDialog(null)}
          onSaved={closeAndReload}
        />
      )}

      {dialog === "end" && (
        <EndTournamentDialog
          tournament={tournament}
          onClose={() => setDialog(null)}
          onEnded={closeAndReload}
        />
      )}
    </>
  );
}

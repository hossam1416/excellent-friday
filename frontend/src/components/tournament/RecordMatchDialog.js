"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { api } from "@/lib/api";
import PlayerAvatar from "@/components/PlayerAvatar";
import { getPlayer } from "@/lib/players";
import { displayFont } from "@/lib/theme";

// نحوّل أي لاعب لشكل واحد: { id, username, avatar }
const toPlayer = (user) => ({
  id: user._id || user.id,
  username: user.username,
  avatar: user.avatar,
});

// لاعبين المباراة: لو رجع null معناها الأدمن لازم يختارهم
function getFixedPlayers({ match, tournament, info }) {
  // تعديل: نفس لاعبين المباراة
  if (match) return [toPlayer(match.playerOne), toPlayer(match.playerTwo)];

  // المباراة الفاصلة
  if (info.requiresFinalMatch) return info.finalMatchPlayers.map(toPlayer);

  // المباراة الأولى
  if (info.mainMatchesPlayed === 0 || !info.nextMatchup) return null;

  // باقي المباريات: المواجهة محددة
  const pair = info.nextMatchup.map((id) =>
    tournament.players.find((player) => player._id === id),
  );

  return pair.every(Boolean) ? pair.map(toPlayer) : null;
}

// match: لو موجودة يعني تعديل، وإلا تسجيل مباراة جديدة
export default function RecordMatchDialog({
  tournament,
  info,
  match,
  onClose,
  onSaved,
}) {
  const isEdit = Boolean(match);
  const fixed = getFixedPlayers({ match, tournament, info });

  const [firstId, setFirstId] = useState("");
  const [secondId, setSecondId] = useState("");
  const [scoreOne, setScoreOne] = useState(
    isEdit ? String(match.scorePlayerOne) : "",
  );
  const [scoreTwo, setScoreTwo] = useState(
    isEdit ? String(match.scorePlayerTwo) : "",
  );
  const [penaltyWinner, setPenaltyWinner] = useState(
    isEdit && match.decidedByPenalties ? match.winner._id : "",
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // اللاعبين الحاليين
  const players =
    fixed ||
    [firstId, secondId].map((id) => {
      const found = tournament.players.find((player) => player._id === id);
      return found ? toPlayer(found) : null;
    });

  // جاهزين لما يكون في لاعبين مختلفين
  const ready = players[0] && players[1] && players[0].id !== players[1].id;

  const isDraw =
    scoreOne !== "" && scoreTwo !== "" && Number(scoreOne) === Number(scoreTwo);

  const title = isEdit
    ? "تعديل آخر مباراة"
    : info.requiresFinalMatch
      ? "تسجيل المباراة الفاصلة"
      : `تسجيل المباراة ${info.mainMatchesPlayed + 1}`;

  const handleSave = async () => {
    const one = Number(scoreOne);
    const two = Number(scoreTwo);

    if (
      scoreOne === "" ||
      scoreTwo === "" ||
      !Number.isInteger(one) ||
      !Number.isInteger(two) ||
      one < 0 ||
      two < 0
    ) {
      setError("اكتب نتيجة صحيحة (أرقام صحيحة من 0 فما فوق)");
      return;
    }

    if (one === two && !penaltyWinner) {
      setError("عند التعادل لازم تحدد فائز ركلات الترجيح");
      return;
    }

    const body = {
      scorePlayerOne: one,
      scorePlayerTwo: two,
      decidedByPenalties: isDraw,
      ...(isDraw && { penaltyWinnerId: penaltyWinner }),
    };

    setError("");
    setSaving(true);

    try {
      if (isEdit) {
        await api(`/matches/${match._id}`, { method: "PATCH", body });
      } else {
        await api("/matches", {
          method: "POST",
          body: {
            ...body,
            tournamentId: tournament._id,
            playerOneId: players[0].id,
            playerTwoId: players[1].id,
          },
        });
      }

      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        {info.requiresFinalMatch && !isEdit && (
          <Alert severity="info">
            المباراة الفاصلة ما بتغيّر الترتيب، وإذا تعادلت بتنحسم بالركلات.
          </Alert>
        )}

        {/* المباراة الأولى: الأدمن بيختار اللاعبين */}
        {!fixed && (
          <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
            <TextField
              select
              label="اللاعب الأول"
              value={firstId}
              onChange={(e) => setFirstId(e.target.value)}
              fullWidth
            >
              {tournament.players.map((player) => (
                <MenuItem key={player._id} value={player._id}>
                  {getPlayer(player.username).name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="اللاعب الثاني"
              value={secondId}
              onChange={(e) => setSecondId(e.target.value)}
              fullWidth
            >
              {tournament.players.map((player) => (
                <MenuItem key={player._id} value={player._id}>
                  {getPlayer(player.username).name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}

        {/* النتيجة */}
        {ready && (
          <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
            {[0, 1].map((i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <PlayerAvatar user={players[i]} size={48} />
                <Typography
                  sx={{
                    fontFamily: displayFont,
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  {getPlayer(players[i].username).name}
                </Typography>
                <TextField
                  type="number"
                  value={i === 0 ? scoreOne : scoreTwo}
                  onChange={(e) =>
                    i === 0
                      ? setScoreOne(e.target.value)
                      : setScoreTwo(e.target.value)
                  }
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      style: { textAlign: "center", fontSize: 28 },
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* ركلات الترجيح عند التعادل */}
        {ready && isDraw && (
          <Box>
            <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 1 }}>
              تعادل. مين فاز بركلات الترجيح؟
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              value={penaltyWinner}
              onChange={(e, value) => value && setPenaltyWinner(value)}
            >
              {players.map((player) => (
                <ToggleButton key={player.id} value={player.id}>
                  {getPlayer(player.username).name}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>إلغاء</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !ready}
        >
          {saving ? "جاري الحفظ..." : "حفظ"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

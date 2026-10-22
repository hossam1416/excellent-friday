"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { api } from "@/lib/api";
import { getPlayer } from "@/lib/players";

export default function EndTournamentDialog({ tournament, onClose, onEnded }) {
  // "none" = بدون بطل
  const [champion, setChampion] = useState("none");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleEnd = async () => {
    setError("");
    setSaving(true);

    try {
      // لازم نبعت body حتى لو فاضي، عشان الباك إند بيقرأ منه
      await api(`/tournaments/${tournament._id}/end`, {
        method: "PATCH",
        body: champion === "none" ? {} : { championId: champion },
      });
      onEnded();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>إنهاء البطولة يدويًا</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography sx={{ color: "text.secondary" }}>
          بعد الإنهاء اليدوي ما بتقدر تعدّل مباريات هالبطولة. اختار البطل أو
          خليها بدون بطل.
        </Typography>

        <ToggleButtonGroup
          exclusive
          fullWidth
          orientation="vertical"
          value={champion}
          onChange={(e, value) => value && setChampion(value)}
        >
          <ToggleButton value="none">بدون بطل</ToggleButton>
          {tournament.players.map((player) => (
            <ToggleButton key={player._id} value={player._id}>
              {getPlayer(player.username).name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>إلغاء</Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleEnd}
          disabled={saving}
        >
          {saving ? "جاري الإنهاء..." : "إنهاء البطولة"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

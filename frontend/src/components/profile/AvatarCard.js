"use client";
import { useState } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { getPlayer } from "@/lib/players";
import { colors, displayFont } from "@/lib/theme";
import PlayerAvatar from "@/components/PlayerAvatar";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

export default function AvatarCard() {
  const { user, setUser, isAdmin } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // لما يختار صورة: نفحصها ونعرض معاينة
  const handleFile = (e) => {
    const selected = e.target.files[0];
    e.target.value = ""; // عشان يقدر يختار نفس الصورة مرة ثانية

    if (!selected) return;

    setSuccess("");

    if (!allowedTypes.includes(selected.type)) {
      setError("يُسمح فقط بصور JPG وPNG وWebP");
      return;
    }

    if (selected.size > 2 * 1024 * 1024) {
      setError("حجم الصورة يجب ألا يتجاوز 2MB");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      // الصورة بتنرفع كـ FormData
      const formData = new FormData();
      formData.append("avatar", file);

      const data = await api("/users/profile", {
        method: "PATCH",
        body: formData,
      });

      setUser(data.user);
      URL.revokeObjectURL(preview);
      setFile(null);
      setPreview("");
      setSuccess("تم تحديث الصورة");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        border: `1px solid ${colors.line}`,
        borderRadius: "28px",
        p: 3.5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        textAlign: "center",
      }}
    >
      <PlayerAvatar
        user={{ username: user.username, avatar: preview || user.avatar }}
        size={120}
      />

      <Box>
        <Typography
          sx={{
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 36,
            lineHeight: 1.1,
          }}
        >
          {getPlayer(user.username).name}
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          {isAdmin ? "أدمن ولاعب" : "لاعب"}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ width: "100%" }}>
          {success}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button component="label" variant="outlined">
          اختيار صورة
          <input
            type="file"
            hidden
            accept={allowedTypes.join(",")}
            onChange={handleFile}
          />
        </Button>

        {file && (
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "جاري الحفظ..." : "حفظ الصورة"}
          </Button>
        )}
      </Box>
    </Box>
  );
}

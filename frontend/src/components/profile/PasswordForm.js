"use client";
import { useState } from "react";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { api } from "@/lib/api";
import { colors } from "@/lib/theme";

export default function PasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // نحدّث الحقل اللي انكتب فيه
  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword.length < 8) {
      setError("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    if (form.newPassword !== form.confirm) {
      setError("تأكيد كلمة المرور غير مطابق");
      return;
    }

    setSaving(true);

    try {
      const data = await api("/users/change-password", {
        method: "PATCH",
        body: {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
      });

      setSuccess(data.message);
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        border: `1px solid ${colors.line}`,
        borderRadius: "28px",
        p: 3.5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h2" sx={{ fontSize: 26 }}>
        تغيير كلمة المرور
      </Typography>

      <TextField
        label="كلمة المرور الحالية"
        type="password"
        autoComplete="current-password"
        value={form.currentPassword}
        onChange={handleChange("currentPassword")}
        fullWidth
      />

      <TextField
        label="كلمة المرور الجديدة"
        type="password"
        autoComplete="new-password"
        value={form.newPassword}
        onChange={handleChange("newPassword")}
        fullWidth
      />

      <TextField
        label="تأكيد كلمة المرور الجديدة"
        type="password"
        autoComplete="new-password"
        value={form.confirm}
        onChange={handleChange("confirm")}
        fullWidth
      />

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Button type="submit" variant="contained" disabled={saving}>
        {saving ? "جاري الحفظ..." : "تغيير كلمة المرور"}
      </Button>
    </Box>
  );
}

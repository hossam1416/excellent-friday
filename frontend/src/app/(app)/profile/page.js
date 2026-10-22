"use client";
import { Box, Typography, Button } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import AvatarCard from "@/components/profile/AvatarCard";
import PasswordForm from "@/components/profile/PasswordForm";

export default function ProfilePage() {
  const { logout } = useAuth();

  return (
    <>
      <Typography
        variant="h1"
        sx={{ fontSize: { xs: 44, md: 60 }, lineHeight: 1.1, mb: 3.5 }}
      >
        حسابي
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          alignItems: "start",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "repeat(2, minmax(0, 1fr))",
          },
        }}
      >
        <AvatarCard />
        <PasswordForm />
      </Box>

      <Button variant="outlined" color="error" onClick={logout} sx={{ mt: 3 }}>
        تسجيل الخروج
      </Button>
    </>
  );
}

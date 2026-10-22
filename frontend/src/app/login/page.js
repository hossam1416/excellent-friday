"use client";
import { useState } from "react";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { keyframes, styled } from "@mui/system";
import { useAuth } from "@/context/AuthContext";
import { colors, displayFont } from "@/lib/theme";

// Visual accent bar configurations
const bars = [
  [100, colors.red],
  [70, colors.burgundy],
  [85, colors.blue],
  [55, colors.red],
  [95, colors.blue],
  [65, colors.burgundy],
  [100, colors.red],
  [75, colors.blue],
  [50, colors.burgundy],
  [90, colors.gold],
];

// Pulsing animation keyframes
const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

// Animated bar component with staggered pulse effect
const AnimatedBar = styled(Box)(({ index }) => ({
  flex: 1,
  borderRadius: "8px",
  animation: `${pulse} 1.5s ease-in-out infinite`,
  animationDelay: `${index * 0.15}s`,
}));

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* Form section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
          px: 3,
          py: 6,
        }}
      >
        {/* Mobile header banner */}
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            width: "100%",
            maxWidth: 400,
          }}
        >
          <Typography variant="h1" sx={{ fontSize: 52, lineHeight: 1.05 }}>
            الجمعة الممتازة
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, mb: 2.5 }}>
            عشر مباريات، ثلاثة لاعبين، وبطل واحد.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: "4px",
              height: 52,
              alignItems: "flex-end",
            }}
          >
            {bars.map(([height, color], i) => (
              <AnimatedBar
                key={i}
                index={i}
                sx={{
                  height: `${height}%`,
                  bgcolor: color,
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Authentication form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h2" sx={{ fontSize: { xs: 26, md: 38 } }}>
            تسجيل الدخول
          </Typography>

          <TextField
            label="اسم المستخدم"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />

          <TextField
            label="كلمة المرور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "جاري الدخول..." : "دخول"}
          </Button>
        </Box>
      </Box>

      {/* Desktop visual sidebar */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {[
          [colors.red, colors.redDark],
          [colors.burgundy, colors.burgundyDark],
          [colors.blue, colors.blueDark],
        ].map(([color, dark]) => (
          <Box
            key={color}
            sx={{
              flex: 1,
              background: `repeating-linear-gradient(90deg, ${color} 0 26px, ${dark} 26px 52px)`,
            }}
          />
        ))}

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            p: 7,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: 2,
            color: "#fff",
          }}
        >
          <Typography
            variant="h1"
            sx={{ fontSize: 88, lineHeight: 1.02, letterSpacing: "-1px" }}
          >
            الجمعة
            <br />
            الممتازة
          </Typography>
          <Typography sx={{ fontSize: 20, fontFamily: displayFont }}>
            عشر مباريات، ثلاثة لاعبين، وبطل واحد.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

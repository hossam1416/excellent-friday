"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import { colors } from "@/lib/theme";

const items = [
  { label: "الرئيسية", href: "/" },
  { label: "البطولات", href: "/tournaments" },
  { label: "الترتيب", href: "/leaderboard" },
  { label: "حسابي", href: "/profile" },
];

export default function FloatingNav() {
  const pathname = usePathname();

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <Box
        component="nav"
        sx={{
          pointerEvents: "auto",
          display: "flex",
          gap: 0.5,
          p: 0.75,
          bgcolor: "#fff",
          border: `1px solid ${colors.line}`,
          borderRadius: "999px",
          boxShadow: "0 10px 30px rgba(20,22,26,0.14)",
        }}
      >
        {items.map((item) => (
          <Box
            key={item.href}
            component={Link}
            href={item.href}
            sx={{
              px: { xs: 2, md: 2.75 },
              py: 1.25,
              borderRadius: "999px",
              fontSize: { xs: 14, md: 15 },
              fontWeight: isActive(item.href) ? 600 : 500,
              color: isActive(item.href) ? "#fff" : colors.muted,
              bgcolor: isActive(item.href) ? colors.ink : "transparent",
              textDecoration: "none",
              transition: "background-color 0.25s, color 0.25s",
            }}
          >
            {item.label}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

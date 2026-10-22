import { Changa, IBM_Plex_Sans_Arabic } from "next/font/google";
import ThemeRegistry from "@/components/ThemeRegistry";
import { AuthProvider } from "@/context/AuthContext";
import "./animations.css";

const changa = Changa({
  subsets: ["arabic", "latin"],
  weight: ["500", "700", "800"],
  variable: "--font-changa",
});

const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
});

export const metadata = {
  title: "الجمعة الممتازة",
  description: "بطولة الجمعة الممتازة",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${changa.variable} ${plex.variable}`}>
      <body>
        <ThemeRegistry>
          <AuthProvider>{children}</AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}

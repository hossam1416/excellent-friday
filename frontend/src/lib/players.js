import { colors } from "./theme";

const PLAYERS = {
  hossam: {
    name: "حسام",
    letter: "ح",
    color: colors.red,
    dark: colors.redDark,
  },
  abdulrahman: {
    name: "عبدالرحمن",
    letter: "ع",
    color: colors.burgundy,
    dark: colors.burgundyDark,
  },
  mohammed: {
    name: "محمد",
    letter: "م",
    color: colors.blue,
    dark: colors.blueDark,
  },
};

export function getPlayer(username = "") {
  const found = PLAYERS[username.toLowerCase()];

  if (found) return found;

  return {
    name: username,
    letter: username.charAt(0),
    color: colors.muted,
    dark: "#4A505C",
  };
}

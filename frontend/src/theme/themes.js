
import { createTheme } from "@mui/material/styles";

// FoodLoop theme color configurations
const themeColors = {
  forest: {
    mode: "light",
    primary: "#173F35",
    secondary: "#8FAE91",
    accent: "#D77B55",
    background: "#F7F4EA",
    paper: "#FFFFFF",
    text: "#252D29",
    muted: "#68736B",
    border: "#E8E5DC",
  },

  midnight: {
    mode: "dark",
    primary: "#65A88B",
    secondary: "#174B3D",
    accent: "#D8B879",
    background: "#101C1A",
    paper: "#1B2B26",
    text: "#E7F2EC",
    muted: "#A7BDB2",
    border: "#30443B",
  },

  ocean: {
    mode: "light",
    primary: "#164B59",
    secondary: "#287F91",
    accent: "#9ACCC8",
    background: "#EFF7F8",
    paper: "#FFFFFF",
    text: "#193B43",
    muted: "#52717A",
    border: "#D6E8E9",
  },

  harvest: {
    mode: "light",
    primary: "#51402D",
    secondary: "#A7A47A",
    accent: "#A66D37",
    background: "#F6F0E5",
    paper: "#FFFCF5",
    text: "#403426",
    muted: "#806D56",
    border: "#E6DCCB",
  },

  monochrome: {
    mode: "light",
    primary: "#171717",
    secondary: "#777777",
    accent: "#444444",
    background: "#F5F5F5",
    paper: "#FFFFFF",
    text: "#171717",
    muted: "#666666",
    border: "#DDDDDD",
  },

  sunset: {
    mode: "light",
    primary: "#713B32",
    secondary: "#D87555",
    accent: "#E8A58B",
    background: "#FFF3EC",
    paper: "#FFFFFF",
    text: "#492E29",
    muted: "#94665B",
    border: "#F0DCD3",
  },
};

// Generate MUI themes
export const themes = Object.fromEntries(
  Object.entries(themeColors).map(([name, colors]) => [
    name,
    createTheme({
      palette: {
        mode: colors.mode,

        primary: {
          main: colors.primary,
        },

        secondary: {
          main: colors.secondary,
        },

        background: {
          default: colors.background,
          paper: colors.paper,
        },

        text: {
          primary: colors.text,
          secondary: colors.muted,
        },

        divider: colors.border,

        error: {
          main: "#C65353",
        },

        warning: {
          main: "#D99A36",
        },

        success: {
          main: "#27845B",
        },
      },

      typography: {
        fontFamily: '"DM Sans", sans-serif',

        h1: {
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
        },

        h2: {
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
        },

        h3: {
          fontFamily: '"Playfair Display", serif',
          fontWeight: 600,
        },

        button: {
          textTransform: "none",
          fontWeight: 600,
        },
      },

      shape: {
        borderRadius: 12,
      },

      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              padding: "10px 20px",
              boxShadow: "none",
            },
          },
        },

        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            },
          },
        },
      },
    }),
  ])
);

export const themeNames = [
  "forest",
  "midnight",
  "ocean",
  "harvest",
  "monochrome",
  "sunset",
];

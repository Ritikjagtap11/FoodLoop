
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { themes, themeNames } from "./themes";

// Create global theme context
const ThemeContext = createContext(null);

// Custom hook to access theme context
// eslint-disable-next-line react-refresh/only-export-components
export const useAppTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useAppTheme must be used inside ThemeContextProvider"
    );
  }

  return context;
};

// Global theme provider
export const ThemeContextProvider = ({ children }) => {
  // Get saved theme or default to forest
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("foodloop-theme");

    return themeNames.includes(savedTheme) ? savedTheme : "forest";
  });

  // Update localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem("foodloop-theme", currentTheme);
  }, [currentTheme]);

  // Change theme function
  const changeTheme = (themeName) => {
    if (themeNames.includes(themeName)) {
      setCurrentTheme(themeName);
    }
  };

  const contextValue = {
    currentTheme,
    changeTheme,
    availableThemes: themeNames,
    isDarkMode: themes[currentTheme].palette.mode === "dark",
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={themes[currentTheme]}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

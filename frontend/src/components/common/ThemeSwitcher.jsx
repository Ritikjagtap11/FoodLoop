
import { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Box,
  Typography,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useAppTheme } from "../../theme/ThemeContext";

const themeOptions = [
  { id: "forest", name: "Forest & Ivory", color: "#173F35" },
  { id: "midnight", name: "Midnight Emerald", color: "#101C1A" },
  { id: "ocean", name: "Ocean Breeze", color: "#164B59" },
  { id: "harvest", name: "Earth & Harvest", color: "#51402D" },
  { id: "monochrome", name: "Minimal Monochrome", color: "#444444" },
  { id: "sunset", name: "Sunset Coral", color: "#D87555" },
];

export default function ThemeSwitcher() {
  const { currentTheme, changeTheme } = useAppTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (themeId) => {
    changeTheme(themeId);
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<PaletteOutlinedIcon />}
        onClick={handleOpen}
        sx={{
          borderRadius: "10px",
          textTransform: "none",
        }}
      >
        Themes
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 230,
              borderRadius: "14px",
              p: 1,
            },
          },
        }}
      >
        {themeOptions.map((theme) => (
          <MenuItem
            key={theme.id}
            selected={currentTheme === theme.id}
            onClick={() => handleThemeChange(theme.id)}
            sx={{ borderRadius: "8px", mb: 0.5 }}
          >
            <ListItemIcon>
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  backgroundColor: theme.color,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              />
            </ListItemIcon>

            <ListItemText
              primary={
                <Typography variant="body2" fontWeight={500}>
                  {theme.name}
                </Typography>
              }
            />

            {currentTheme === theme.id && (
              <CheckCircleIcon
                color="success"
                fontSize="small"
              />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <Button
      variant="outlined"
      color="error"
      size="medium"
      startIcon={<LogOut size={17} />}
      onClick={handleLogout}
      sx={{
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 700,
        px: 2,
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
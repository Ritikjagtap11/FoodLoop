import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  // Check whether user is logged in
  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(userData);
  } catch (error) {
    console.log(error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  // Check whether user has the required role
  if (!allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "ADMIN":
        return <Navigate to="/admin/dashboard" replace />;

      case "RESTAURANT":
        return <Navigate to="/restaurant/dashboard" replace />;

      case "NGO":
        return <Navigate to="/ngo/dashboard" replace />;

      default:
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;

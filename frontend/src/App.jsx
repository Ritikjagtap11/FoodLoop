import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/public/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import ProtectedRoute from "./components/common/ProtectedRoute";
import LogoutButton from "./components/common/LogoutButton";
import AdminDashboard from "./pages/admin/AdminDashboard";
// Temporary dashboard placeholder
const DashboardPlaceholder = ({ role }) => {
  return (
    <div style={{ padding: "40px" }}>
      <h1>{role} Dashboard</h1>
      <p>Welcome to FoodLoop!</p>

      <LogoutButton />
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Restaurant Protected Route */}
      <Route
        element={<ProtectedRoute allowedRoles={["RESTAURANT"]} />}
      >
        <Route
          path="/restaurant/dashboard"
          element={<DashboardPlaceholder role="Restaurant" />}
        />
      </Route>

      {/* NGO Protected Route */}
      <Route element={<ProtectedRoute allowedRoles={["NGO"]} />}>
        <Route
          path="/ngo/dashboard"
          element={<DashboardPlaceholder role="NGO" />}
        />
      </Route>

      {/* Admin Protected Route */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
  <Route
    path="/admin/dashboard"
    element={<AdminDashboard />}
  />
</Route>
    </Routes>
  );
}

export default App;
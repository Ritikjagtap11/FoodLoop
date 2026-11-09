
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";

import {
  Eye,
  EyeOff,
  Leaf,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";

import API from "../../services/api";

// Custom Login Validation
const validateLoginForm = (formData) => {
  const errors = {};

  if (!formData.email.trim()) {
    errors.email = "Email address is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
  ) {
    errors.email = "Please enter a valid email address";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);
    setLoginError(null);

    if (submitted) {
      const validationErrors = validateLoginForm(updatedFormData);

      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors[name] || "",
      }));
    }
  };

  // Handle Login Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitted(true);
    setLoginError(null);

    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        setLoginError({
          type: "error",
          title: "Login failed",
          message: "Invalid server response. Please try again.",
        });
        return;
      }

      // Save authentication details
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect according to user role
      const dashboardRoutes = {
        RESTAURANT: "/restaurant/dashboard",
        NGO: "/ngo/dashboard",
        ADMIN: "/admin/dashboard",
      };

      const destination = dashboardRoutes[user.role];

      if (!destination) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setLoginError({
          type: "error",
          title: "Invalid account role",
          message: "Your account has an unrecognized user role.",
        });
        return;
      }

      navigate(destination, { replace: true });

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        const { status, data } = error.response;
        const code = data?.code;

        // PENDING ACCOUNT
        if (code === "ACCOUNT_PENDING") {
          setLoginError({
            type: "warning",
            title: "Your account is awaiting approval",
            message:
              data.message ||
              "Your registration is under review. Please wait for admin verification.",
            icon: Clock,
          });
        }

        // REJECTED ACCOUNT
        else if (code === "ACCOUNT_REJECTED") {
          setLoginError({
            type: "error",
            title: "Your verification request was rejected",
            message:
              data.message ||
              "Your organization verification request was rejected.",
            remarks: data.remarks,
            icon: XCircle,
          });
        }

        // OTHER INACTIVE ACCOUNT
        else if (code === "ACCOUNT_INACTIVE") {
          setLoginError({
            type: "warning",
            title: "Account inactive",
            message:
              data.message ||
              "Please contact the FoodLoop administration team.",
            icon: Info,
          });
        }

        // INVALID CREDENTIALS
        else if (status === 401) {
          setLoginError({
            type: "error",
            title: "Login unsuccessful",
            message:
              data.message || "Invalid email address or password.",
          });
        }

        // VALIDATION ERROR
        else if (status === 400) {
          setLoginError({
            type: "error",
            title: "Invalid login details",
            message:
              data.message || "Please enter valid login details.",
          });
        }

        // OTHER ERRORS
        else {
          setLoginError({
            type: "error",
            title: "Something went wrong",
            message:
              data.message || "Login failed. Please try again.",
          });
        }
      } else {
        setLoginError({
          type: "error",
          title: "Connection failed",
          message:
            "Unable to connect to the server. Please check your backend.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const LoginMessageIcon = loginError?.icon;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        py: 5,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "inline-flex",
                p: 1.5,
                borderRadius: 3,
                bgcolor: "primary.main",
                color: "#fff",
                mb: 2,
              }}
            >
              <Leaf size={30} />
            </Box>

            <Typography variant="h4" fontWeight={700}>
              Welcome Back
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Sign in to continue making a difference with FoodLoop.
            </Typography>
          </Box>

          {/* Login Form */}
          <Box component="form" noValidate onSubmit={handleSubmit}>
            {/* Email */}
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Email Address
            </Typography>

            <TextField
              fullWidth
              type="text"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              disabled={loading}
              sx={{ mb: 3 }}
            />

            {/* Password */}
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Password
            </Typography>

            <TextField
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      edge="end"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Forgot Password */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 3,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: "not-allowed" }}
              >
                Forgot password?
              </Typography>
            </Box>

            {/* Login Status Message */}
            {loginError && (
              <Alert
                severity={loginError.type}
                icon={
                  LoginMessageIcon ? (
                    <LoginMessageIcon size={21} />
                  ) : undefined
                }
                sx={{
                  mb: 2.5,
                  borderRadius: 2,
                  alignItems: "flex-start",
                  "& .MuiAlert-message": {
                    width: "100%",
                  },
                }}
              >
                <Stack spacing={0.8}>
                  <Typography fontWeight={800}>
                    {loginError.title}
                  </Typography>

                  <Typography variant="body2">
                    {loginError.message}
                  </Typography>

                  {loginError.remarks && (
                    <Box
                      sx={{
                        mt: 1,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={800}
                        display="block"
                        sx={{ mb: 0.5 }}
                      >
                        ADMIN REMARKS
                      </Typography>

                      <Typography variant="body2">
                        {loginError.remarks}
                      </Typography>
                    </Box>
                  )}

                  {loginError.type === "warning" && (
                    <Typography variant="caption" sx={{ mt: 0.5 }}>
                      You can try logging in again later to check your
                      account status.
                    </Typography>
                  )}
                </Stack>
              </Alert>
            )}

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              endIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <ArrowRight size={18} />
                )
              }
              sx={{ py: 1.5 }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Register Link */}
          <Typography
            sx={{
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Don't have an account?{" "}
            <Box
              component={Link}
              to="/register"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Create Account
            </Box>
          </Typography>

          {/* Footer */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              textAlign: "center",
              mt: 4,
            }}
          >
            © 2026 FoodLoop. Good food. Shared better.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;

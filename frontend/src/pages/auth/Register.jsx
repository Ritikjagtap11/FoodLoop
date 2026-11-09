import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Checkbox,
  FormHelperText,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";

import {
  Eye,
  EyeOff,
  Leaf,
  ArrowRight,
  Store,
  HeartHandshake,
} from "lucide-react";

import API from "../../services/api";

// Custom validation
const validateForm = (formData) => {
  const errors = {};

  if (!formData.organizationName.trim()) {
    errors.organizationName = "Organization name is required";
  }

  if (!formData.contactName.trim()) {
    errors.contactName = "Contact person name is required";
  }

  if (!formData.email.trim()) {
    errors.email = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!/^\d{10}$/.test(formData.phone)) {
    errors.phone = "Enter a valid 10-digit phone number";
  }

  if (!formData.address.trim()) {
    errors.address = "Organization address is required";
  }

  if (!formData.city.trim()) {
    errors.city = "City is required";
  }

  if (!formData.documentNumber.trim()) {
    errors.documentNumber = "Document number is required";
  }

  if (!formData.documentUrl.trim()) {
    errors.documentUrl = "Document URL is required";
  } else {
    try {
      const url = new URL(formData.documentUrl);

      if (!["http:", "https:"].includes(url.protocol)) {
        errors.documentUrl = "Enter a valid HTTP or HTTPS URL";
      }
    } catch {
      errors.documentUrl = "Please enter a valid document URL";
    }
  }

  if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!formData.acceptedTerms) {
    errors.acceptedTerms = "Please accept the terms and conditions";
  }

  return errors;
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    phone: "",
    organizationType: "RESTAURANT",
    address: "",
    city: "",
    documentType: "FSSAI",
    documentNumber: "",
    documentUrl: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    setFormData(updatedFormData);

    setServerError("");
    setSuccessMessage("");

    if (submitted) {
      const validationErrors = validateForm(updatedFormData);

      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors[name],
        ...(name === "password"
          ? {
              confirmPassword: validationErrors.confirmPassword,
            }
          : {}),
      }));
    }
  };

  // Handle organization type selection
  const handleOrganizationChange = (e) => {
    const role = e.target.value;

    setFormData((prev) => ({
      ...prev,
      organizationType: role,
      documentType: role === "RESTAURANT" ? "FSSAI" : "NGO_DARPAN",
    }));

    setServerError("");
    setSuccessMessage("");
  };

  // Submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitted(true);
    setServerError("");
    setSuccessMessage("");

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const registrationData = {
      name: formData.contactName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.organizationType,
      organization_name: formData.organizationName.trim(),
      phone: formData.phone,
      address: formData.address.trim(),
      city: formData.city.trim(),
      document_type: formData.documentType,
      document_number: formData.documentNumber.trim(),
      document_url: formData.documentUrl.trim(),
    };

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/register",
        registrationData
      );

      setSuccessMessage(
        response.data.message || "Registration successful!"
      );

      // Clear the form after successful registration
      setFormData({
        organizationName: "",
        contactName: "",
        email: "",
        phone: "",
        organizationType: "RESTAURANT",
        address: "",
        city: "",
        documentType: "FSSAI",
        documentNumber: "",
        documentUrl: "",
        password: "",
        confirmPassword: "",
        acceptedTerms: false,
      });

      setErrors({});
      setSubmitted(false);
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        if (status === 409) {
          setServerError(
            responseData.message || "This email is already registered."
          );
        } else if (status === 400 && responseData.errors) {
          const backendErrors = {};

          responseData.errors.forEach((item) => {
            backendErrors[item.path || item.param] = item.msg;
          });

          setErrors((prev) => ({
            ...prev,
            ...backendErrors,
          }));

          setServerError(
            "Please check the form. Some submitted details are invalid."
          );
        } else {
          setServerError(
            responseData.message || "Registration failed. Please try again."
          );
        }
      } else {
        setServerError(
          "Unable to connect to the server. Please check your backend."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const documentTypes =
    formData.organizationType === "RESTAURANT"
      ? [
          { value: "FSSAI", label: "FSSAI License" },
          { value: "OTHER", label: "Other Document" },
        ]
      : [
          { value: "NGO_DARPAN", label: "NGO Darpan Certificate" },
          { value: "OTHER", label: "Other Document" },
        ];

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
              Join FoodLoop
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Create your account and help reduce food waste.
            </Typography>
          </Box>

          {/* Backend messages */}
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
              <Typography variant="body2" sx={{ mt: 1 }}>
                You can now proceed to{" "}
                <Box
                  component={Link}
                  to="/login"
                  sx={{
                    color: "success.dark",
                    fontWeight: 700,
                  }}
                >
                  Sign In
                </Box>
                .
              </Typography>
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit}>
            {/* Organization Type */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel
                sx={{
                  color: "text.primary",
                  fontWeight: 600,
                  mb: 1.5,
                }}
              >
                Choose Organization Type
              </FormLabel>

              <RadioGroup
                name="organizationType"
                value={formData.organizationType}
                onChange={handleOrganizationChange}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                    },
                    gap: 2,
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      borderColor:
                        formData.organizationType === "RESTAURANT"
                          ? "primary.main"
                          : "divider",
                      bgcolor:
                        formData.organizationType === "RESTAURANT"
                          ? "action.selected"
                          : "background.paper",
                    }}
                  >
                    <FormControlLabel
                      value="RESTAURANT"
                      control={<Radio />}
                      label={
                        <Box>
                          <Store size={20} />
                          <Typography fontWeight={600}>
                            Restaurant
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Donate surplus food
                          </Typography>
                        </Box>
                      }
                      sx={{ m: 0, width: "100%", gap: 1 }}
                    />
                  </Paper>

                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      borderColor:
                        formData.organizationType === "NGO"
                          ? "primary.main"
                          : "divider",
                      bgcolor:
                        formData.organizationType === "NGO"
                          ? "action.selected"
                          : "background.paper",
                    }}
                  >
                    <FormControlLabel
                      value="NGO"
                      control={<Radio />}
                      label={
                        <Box>
                          <HeartHandshake size={20} />
                          <Typography fontWeight={600}>NGO</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Receive surplus food
                          </Typography>
                        </Box>
                      }
                      sx={{ m: 0, width: "100%", gap: 1 }}
                    />
                  </Paper>
                </Box>
              </RadioGroup>
            </FormControl>

            {/* Organization Name */}
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Organization Name
            </Typography>

            <TextField
              fullWidth
              name="organizationName"
              placeholder="Enter organization name"
              value={formData.organizationName}
              onChange={handleChange}
              error={Boolean(errors.organizationName)}
              helperText={errors.organizationName}
              sx={{ mb: 2.5 }}
            />

            {/* Contact Person */}
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Contact Person
            </Typography>

            <TextField
              fullWidth
              name="contactName"
              placeholder="Enter contact person's name"
              value={formData.contactName}
              onChange={handleChange}
              error={Boolean(errors.contactName)}
              helperText={errors.contactName}
              sx={{ mb: 2.5 }}
            />

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
              sx={{ mb: 2.5 }}
            />

            {/* Phone */}
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Phone Number
            </Typography>

            <TextField
              fullWidth
              type="text"
              name="phone"
              placeholder="Enter 10-digit phone number"
              value={formData.phone}
              onChange={handleChange}
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              slotProps={{
                htmlInput: {
                  maxLength: 10,
                  inputMode: "numeric",
                },
              }}
              sx={{ mb: 2.5 }}
            />

            {/* Address */}
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Organization Address
            </Typography>

            <TextField
              fullWidth
              name="address"
              placeholder="Enter complete address"
              value={formData.address}
              onChange={handleChange}
              error={Boolean(errors.address)}
              helperText={errors.address}
              sx={{ mb: 2.5 }}
            />

            {/* City */}
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              City
            </Typography>

            <TextField
              fullWidth
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
              error={Boolean(errors.city)}
              helperText={errors.city}
              sx={{ mb: 2.5 }}
            />

            <Divider sx={{ my: 3 }} />

            {/* Verification Details */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Verification Details
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Provide your organization's registration document details.
            </Typography>

            {/* Document Type */}
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Document Type
            </Typography>

            <TextField
              select
              fullWidth
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              sx={{ mb: 2.5 }}
            >
              {documentTypes.map((document) => (
                <MenuItem key={document.value} value={document.value}>
                  {document.label}
                </MenuItem>
              ))}
            </TextField>

            {/* Document Number */}
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Document Number
            </Typography>

            <TextField
              fullWidth
              name="documentNumber"
              placeholder="Enter license or registration number"
              value={formData.documentNumber}
              onChange={handleChange}
              error={Boolean(errors.documentNumber)}
              helperText={errors.documentNumber}
              sx={{ mb: 2.5 }}
            />

            {/* Document URL */}
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Document URL
            </Typography>

            <TextField
              fullWidth
              name="documentUrl"
              placeholder="https://example.com/document.pdf"
              value={formData.documentUrl}
              onChange={handleChange}
              error={Boolean(errors.documentUrl)}
              helperText={
                errors.documentUrl ||
                "Paste a publicly accessible link to your document."
              }
              sx={{ mb: 2.5 }}
            />

            <Divider sx={{ my: 3 }} />

            {/* Password */}
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Password
            </Typography>

            <TextField
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 2.5 }}
            />

            {/* Confirm Password */}
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Confirm Password
            </Typography>

            <TextField
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        edge="end"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 2 }}
            />

            {/* Terms */}
            <FormControl
              error={Boolean(errors.acceptedTerms)}
              sx={{ mb: 2 }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="acceptedTerms"
                    checked={formData.acceptedTerms}
                    onChange={handleChange}
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    I agree to the Terms and Conditions.
                  </Typography>
                }
              />

              {errors.acceptedTerms && (
                <FormHelperText>{errors.acceptedTerms}</FormHelperText>
              )}
            </FormControl>

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
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Login Link */}
          <Typography
            sx={{
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Already have an account?{" "}
            <Box
              component={Link}
              to="/login"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign In
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

export default Register;
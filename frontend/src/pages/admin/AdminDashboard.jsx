
import { useCallback, useEffect, useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import {
  Leaf,
  LayoutDashboard,
  FileCheck,
  Users,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  ShieldCheck,
  Building2,
  Clock3,
  AlertCircle,
} from "lucide-react";

import API from "../../services/api";
import LogoutButton from "../../components/common/LogoutButton";

// Rejection reasons
const rejectionReasons = [
  "Invalid or expired document",
  "Incorrect document details",
  "Document not readable",
  "Incomplete documentation",
  "Other reason",
];

// Format date
const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Status chip
const StatusChip = ({ status }) => {
  const colors = {
    PENDING: "warning",
    APPROVED: "success",
    REJECTED: "error",
  };

  return (
    <Chip
      label={status || "UNKNOWN"}
      color={colors[status] || "default"}
      size="small"
      sx={{
        fontWeight: 700,
        borderRadius: 2,
        minWidth: 90,
      }}
    />
  );
};

// Statistics card
const StatCard = ({ title, value, icon: Icon, color, description }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: "100%",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: theme.shadows[3],
        },
      }}
    >
      <Avatar
        sx={{
          width: 54,
          height: 54,
          bgcolor: `${color}18`,
          color,
        }}
      >
        <Icon size={25} />
      </Avatar>

      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>

        <Typography
          variant="h4"
          fontWeight={800}
          sx={{ my: 0.3 }}
        >
          {value}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Paper>
  );
};

// Reusable verification table
const VerificationTable = ({
  title,
  subtitle,
  icon: Icon,
  records,
  type,
  onApprove,
  onReject,
}) => {
  const theme = useTheme();

  const isPending = type === "pending";
  const isApproved = type === "approved";
  const isRejected = type === "rejected";

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        overflow: "hidden",
        mb: 3,
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            sx={{
              bgcolor: "action.hover",
              color: "primary.main",
              width: 42,
              height: 42,
            }}
          >
            <Icon size={21} />
          </Avatar>

          <Box>
            <Typography variant="h6" fontWeight={800}>
              {title}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        </Stack>

        <Chip
          label={`${records.length} ${records.length === 1 ? "record" : "records"}`}
          variant="outlined"
          size="small"
        />
      </Box>

      <Divider />

      {records.length === 0 ? (
        <Box
          sx={{
            py: 5,
            px: 2,
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              mx: "auto",
              mb: 1.5,
              bgcolor: "action.hover",
              color: "text.secondary",
            }}
          >
            {isPending ? (
              <Clock3 size={23} />
            ) : (
              <FileCheck size={23} />
            )}
          </Avatar>

          <Typography fontWeight={700}>
            {isPending
              ? "No pending verification requests"
              : `No ${type} organizations yet`}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {isPending
              ? "New organization requests will appear here."
              : "Records will appear here when available."}
          </Typography>
        </Box>
      ) : (
        <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
          <Table sx={{ minWidth: 850 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 800 }}>Organization</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Document</TableCell>

                {isApproved && (
                  <TableCell sx={{ fontWeight: 800 }}>Approved On</TableCell>
                )}

                {isRejected && (
                  <>
                    <TableCell sx={{ fontWeight: 800 }}>Rejected On</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Remarks</TableCell>
                  </>
                )}

                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>

                {isPending && (
                  <TableCell align="center" sx={{ fontWeight: 800 }}>
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {records.map((record) => (
                <TableRow
                  key={record.organization_id}
                  hover
                >
                  <TableCell>
                    <Typography fontWeight={700}>
                      {record.organization_name || "—"}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      ID: {record.organization_id}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={record.organization_type || "—"}
                    />
                  </TableCell>

                  <TableCell>{record.city || "—"}</TableCell>

                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {record.document_type || "—"}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {record.document_number || "—"}
                      </Typography>

                      {record.document_url && (
                        <Button
                          size="small"
                          startIcon={<Eye size={15} />}
                          onClick={() =>
                            window.open(
                              record.document_url,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            px: 0,
                            mt: 0.3,
                            minWidth: 0,
                          }}
                        >
                          View document
                        </Button>
                      )}
                    </Box>
                  </TableCell>

                  {isApproved && (
                    <TableCell>
                      {formatDate(record.reviewed_at)}
                    </TableCell>
                  )}

                  {isRejected && (
                    <>
                      <TableCell>
                        {formatDate(record.reviewed_at)}
                      </TableCell>

                      <TableCell sx={{ maxWidth: 220 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            whiteSpace: "normal",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {record.remarks || "No remarks provided"}
                        </Typography>
                      </TableCell>
                    </>
                  )}

                  <TableCell>
                    <StatusChip status={record.verification_status || record.review_status} />
                  </TableCell>

                  {isPending && (
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={1}
                      >
                        <Button
                          size="small"
                          color="success"
                          variant="contained"
                          startIcon={<CheckCircle size={15} />}
                          onClick={() => onApprove(record)}
                          sx={{ textTransform: "none" }}
                        >
                          Approve
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          startIcon={<XCircle size={15} />}
                          onClick={() => onReject(record)}
                          sx={{ textTransform: "none" }}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

function AdminDashboard() {
  const theme = useTheme();

  const [records, setRecords] = useState({
    pending: [],
    approved: [],
    rejected: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogType, setDialogType] = useState("");

  const [rejectionReason, setRejectionReason] = useState("");
  const [additionalRemarks, setAdditionalRemarks] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch dashboard records
  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      await API.get("/admin/dashboard");

      const response = await API.get("/admin/verifications/all");

      const data = response.data?.data || {};

      setRecords({
        pending: data.pending || [],
        approved: data.approved || [],
        rejected: data.rejected || [],
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load verification records. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Open approval dialog
  const openApproveDialog = (record) => {
    setSelectedRecord(record);
    setDialogType("approve");
    setDialogError("");
  };

  // Open rejection dialog
  const openRejectDialog = (record) => {
    setSelectedRecord(record);
    setDialogType("reject");
    setRejectionReason("");
    setAdditionalRemarks("");
    setDialogError("");
  };

  // Close dialog
  const closeDialog = () => {
    if (submitting) return;

    setSelectedRecord(null);
    setDialogType("");
    setRejectionReason("");
    setAdditionalRemarks("");
    setDialogError("");
  };

  // Confirm approval or rejection
  const handleVerification = async () => {
    if (!selectedRecord) return;

    let remarks = "";

    if (dialogType === "reject") {
      if (!rejectionReason) {
        setDialogError("Please select a rejection reason.");
        return;
      }

      if (!additionalRemarks.trim()) {
        setDialogError("Please enter additional remarks.");
        return;
      }

      remarks = `${rejectionReason}: ${additionalRemarks.trim()}`;
    }

    try {
      setSubmitting(true);
      setDialogError("");
      setError("");
      setSuccess("");

      const status = dialogType === "approve" ? "APPROVED" : "REJECTED";

      await API.put(
        `/admin/verifications/${selectedRecord.organization_id}`,
        {
          status,
          remarks,
        }
      );

      setSuccess(
        dialogType === "approve"
          ? "Organization approved successfully."
          : "Organization rejected successfully."
      );

      setSelectedRecord(null);
      setDialogType("");
      setRejectionReason("");
      setAdditionalRemarks("");

      await fetchRecords();
    } catch (err) {
      setDialogError(
        err.response?.data?.message ||
          "Unable to update verification status."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const totalOrganizations =
    records.pending.length +
    records.approved.length +
    records.rejected.length;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* NAVIGATION BAR */}
      <Paper
        elevation={0}
        square
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              minHeight: 76,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
              py: 1.5,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                }}
              >
                <Leaf size={25} />
              </Avatar>

              <Box>
                <Typography variant="h6" fontWeight={900} lineHeight={1.2}>
                  FoodLoop
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Administration Panel
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              flexWrap="wrap"
            >
              {/* <Chip
                icon={<LayoutDashboard size={15} />}
                label="Overview"
                color="primary"
                variant="outlined"
              /> */}

              <Button
                startIcon={<RefreshCw size={16} />}
                onClick={fetchRecords}
                disabled={loading}
                sx={{ textTransform: "none" }}
              >
                Refresh
              </Button>

              <LogoutButton />
            </Stack>
          </Box>
        </Container>
      </Paper>

      {/* MAIN CONTENT */}
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        {/* PAGE HEADING */}
        <Box sx={{ mb: 3.5 }}>
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{ mb: 0.8, fontSize: { xs: 25, md: 32 } }}
          >
            Admin Dashboard
          </Typography>

          <Typography color="text.secondary">
            Manage organization registrations and verification requests.
          </Typography>
        </Box>

        {/* ALERTS */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mb: 2, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            onClose={() => setSuccess("")}
            sx={{ mb: 2, borderRadius: 2 }}
          >
            {success}
          </Alert>
        )}

        {/* STATISTICS */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Organizations"
              value={totalOrganizations}
              icon={Building2}
              color={theme.palette.primary.main}
              description="Registered organizations"
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Pending"
              value={records.pending.length}
              icon={Clock3}
              color={theme.palette.warning.main}
              description="Awaiting verification"
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Approved"
              value={records.approved.length}
              icon={CheckCircle}
              color={theme.palette.success.main}
              description="Verified organizations"
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Rejected"
              value={records.rejected.length}
              icon={XCircle}
              color={theme.palette.error.main}
              description="Rejected applications"
            />
          </Grid>
        </Grid>

        {/* LOADING */}
        {loading ? (
          <Box
            sx={{
              py: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress color="primary" />

            <Typography color="text.secondary">
              Loading organization records...
            </Typography>
          </Box>
        ) : (
          <>
            {/* PENDING REQUESTS */}
            <VerificationTable
              title="Pending Requests"
              subtitle="Review and verify newly registered organizations."
              icon={Clock3}
              records={records.pending}
              type="pending"
              onApprove={openApproveDialog}
              onReject={openRejectDialog}
            />

            {/* APPROVED ORGANIZATIONS */}
            <VerificationTable
              title="Approved Organizations"
              subtitle="Organizations successfully verified by the admin."
              icon={ShieldCheck}
              records={records.approved}
              type="approved"
            />

            {/* REJECTED ORGANIZATIONS */}
            <VerificationTable
              title="Rejected Organizations"
              subtitle="Rejected applications and their review remarks."
              icon={AlertCircle}
              records={records.rejected}
              type="rejected"
            />
          </>
        )}

        {/* FOOTER */}
        <Box
          sx={{
            mt: 4,
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © 2026 FoodLoop. Admin Dashboard.
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Reducing food waste, building a better tomorrow.
          </Typography>
        </Box>
      </Container>

      {/* APPROVAL / REJECTION DIALOG */}
      <Dialog
        open={Boolean(dialogType && selectedRecord)}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor:
                  dialogType === "approve"
                    ? "success.light"
                    : "error.light",
                color:
                  dialogType === "approve"
                    ? "success.dark"
                    : "error.dark",
              }}
            >
              {dialogType === "approve" ? (
                <CheckCircle size={22} />
              ) : (
                <XCircle size={22} />
              )}
            </Avatar>

            <Box>
              <Typography variant="h6" fontWeight={800}>
                {dialogType === "approve"
                  ? "Approve Organization"
                  : "Review Rejection"}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Organization verification
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {selectedRecord && (
            <>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  mb: 2.5,
                  bgcolor: "action.hover",
                }}
              >
                <Typography variant="subtitle1" fontWeight={800}>
                  {selectedRecord.organization_name}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Organization ID:</strong>{" "}
                    {selectedRecord.organization_id}
                  </Typography>

                  <Typography variant="body2">
                    <strong>Type:</strong>{" "}
                    {selectedRecord.organization_type}
                  </Typography>

                  <Typography variant="body2">
                    <strong>City:</strong> {selectedRecord.city}
                  </Typography>

                  <Typography variant="body2">
                    <strong>Document Type:</strong>{" "}
                    {selectedRecord.document_type}
                  </Typography>

                  <Typography variant="body2">
                    <strong>Document Number:</strong>{" "}
                    {selectedRecord.document_number}
                  </Typography>

                  {selectedRecord.document_url && (
                    <Button
                      size="small"
                      startIcon={<Eye size={15} />}
                      onClick={() =>
                        window.open(
                          selectedRecord.document_url,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                      sx={{
                        alignSelf: "flex-start",
                        textTransform: "none",
                      }}
                    >
                      View submitted document
                    </Button>
                  )}
                </Stack>
              </Paper>

              {dialogType === "approve" ? (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  Are you sure you want to approve this organization?
                  The organization will be activated.
                </Alert>
              ) : (
                <Stack spacing={2}>
                  <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    Select a reason and provide remarks before rejecting this
                    organization's verification request.
                  </Alert>

                  <FormControl fullWidth required>
                    <InputLabel id="rejection-reason-label">
                      Rejection Reason
                    </InputLabel>

                    <Select
                      labelId="rejection-reason-label"
                      value={rejectionReason}
                      label="Rejection Reason"
                      onChange={(event) => {
                        setRejectionReason(event.target.value);
                        setDialogError("");
                      }}
                    >
                      {rejectionReasons.map((reason) => (
                        <MenuItem key={reason} value={reason}>
                          {reason}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Additional Remarks"
                    placeholder="Explain why this document or application is being rejected..."
                    value={additionalRemarks}
                    onChange={(event) => {
                      setAdditionalRemarks(event.target.value);
                      setDialogError("");
                    }}
                    multiline
                    rows={4}
                    fullWidth
                    required
                  />

                  <Typography variant="caption" color="text.secondary">
                    These remarks will be saved and displayed in the rejected
                    organizations section.
                  </Typography>
                </Stack>
              )}

              {dialogError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {dialogError}
                </Alert>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={closeDialog}
            color="inherit"
            disabled={submitting}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color={dialogType === "approve" ? "success" : "error"}
            onClick={handleVerification}
            disabled={submitting}
            startIcon={
              submitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : dialogType === "approve" ? (
                <CheckCircle size={17} />
              ) : (
                <XCircle size={17} />
              )
            }
            sx={{
              textTransform: "none",
              px: 2.5,
            }}
          >
            {submitting
              ? "Processing..."
              : dialogType === "approve"
                ? "Confirm Approval"
                : "Confirm Rejection"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminDashboard;

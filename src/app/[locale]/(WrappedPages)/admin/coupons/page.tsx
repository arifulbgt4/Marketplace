"use client";

import {
  AddOutlined,
  ArchiveOutlined,
  EditOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import {
  AdminEmpty,
  AdminError,
  AdminLoading,
  AdminPageHeader,
  adminRequest,
} from "src/components/Admin";

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discountType: "percentage" | "fixed";
  discountValue: string | number;
  minOrderAmount: string | number | null;
  maxDiscountAmount: string | number | null;
  scope: "all" | "category" | "product";
  scopeIds: string[];
  usageLimit: number | null;
  usagePerUser: number | null;
  usedCount: number;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
};

const emptyForm = {
  code: "",
  description: "",
  discountType: "percentage" as "percentage" | "fixed",
  discountValue: "",
  minOrderAmount: "",
  maxDiscountAmount: "",
  scope: "all" as "all" | "category" | "product",
  scopeIds: "",
  usageLimit: "",
  usagePerUser: "",
  startsAt: "",
  expiresAt: "",
  isActive: true,
};

const nullableNumber = (value: string) => (value === "" ? null : Number(value));

const localDateTime = (value: string | null) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

export default function CouponsAdminPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setCoupons(await adminRequest<Coupon[]>("/api/admin/coupons"));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load coupons",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreate() {
    setEditingId("");
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(coupon: Coupon) {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      description: coupon.description ?? "",
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrderAmount:
        coupon.minOrderAmount === null ? "" : String(coupon.minOrderAmount),
      maxDiscountAmount:
        coupon.maxDiscountAmount === null
          ? ""
          : String(coupon.maxDiscountAmount),
      scope: coupon.scope,
      scopeIds: Array.isArray(coupon.scopeIds)
        ? coupon.scopeIds.join(", ")
        : "",
      usageLimit: coupon.usageLimit === null ? "" : String(coupon.usageLimit),
      usagePerUser:
        coupon.usagePerUser === null ? "" : String(coupon.usagePerUser),
      startsAt: localDateTime(coupon.startsAt),
      expiresAt: localDateTime(coupon.expiresAt),
      isActive: coupon.isActive,
    });
    setDialogOpen(true);
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      await adminRequest(
        editingId ? `/api/admin/coupons/${editingId}` : "/api/admin/coupons",
        {
          method: editingId ? "PATCH" : "POST",
          body: JSON.stringify({
            code: form.code.trim().toUpperCase(),
            description: form.description || null,
            discountType: form.discountType,
            discountValue: Number(form.discountValue),
            minOrderAmount: nullableNumber(form.minOrderAmount),
            maxDiscountAmount: nullableNumber(form.maxDiscountAmount),
            scope: form.scope,
            scopeIds:
              form.scope === "all"
                ? []
                : form.scopeIds
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
            usageLimit: nullableNumber(form.usageLimit),
            usagePerUser: nullableNumber(form.usagePerUser),
            startsAt: form.startsAt
              ? new Date(form.startsAt).toISOString()
              : null,
            expiresAt: form.expiresAt
              ? new Date(form.expiresAt).toISOString()
              : null,
            isActive: form.isActive,
          }),
        },
      );
      setDialogOpen(false);
      setSuccess(editingId ? "Coupon updated." : "Coupon created.");
      await load();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save coupon",
      );
    } finally {
      setSaving(false);
    }
  }

  async function archive(coupon: Coupon) {
    if (!window.confirm(`Archive coupon "${coupon.code}"?`)) return;
    setError("");
    try {
      await adminRequest(`/api/admin/coupons/${coupon.id}`, {
        method: "DELETE",
      });
      setSuccess("Coupon archived.");
      await load();
    } catch (archiveError) {
      setError(
        archiveError instanceof Error
          ? archiveError.message
          : "Unable to archive coupon",
      );
    }
  }

  return (
    <Box>
      <AdminPageHeader
        title="Coupons"
        description="Create controlled discounts with scope, validity, and usage limits."
        action={
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={openCreate}
          >
            New coupon
          </Button>
        }
      />
      {success ? (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      ) : null}
      {error ? (
        <Box mb={2}>
          <AdminError message={error} retry={load} />
        </Box>
      ) : null}
      {loading ? <AdminLoading label="Loading coupons…" /> : null}
      {!loading && !error && coupons.length === 0 ? (
        <AdminEmpty
          title="No coupons"
          description="Create a coupon when the business is ready to run a promotion."
        />
      ) : null}
      {!loading && coupons.length > 0 ? (
        <TableContainer component={Paper} variant="outlined">
          <Table aria-label="Marketplace coupons">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Scope</TableCell>
                <TableCell>Usage</TableCell>
                <TableCell>Validity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id} hover>
                  <TableCell>
                    <Typography fontWeight={700}>{coupon.code}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {coupon.description || "No description"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {coupon.discountType === "percentage"
                      ? `${Number(coupon.discountValue)}%`
                      : Number(coupon.discountValue).toFixed(2)}
                  </TableCell>
                  <TableCell>{coupon.scope}</TableCell>
                  <TableCell>
                    {coupon.usedCount}
                    {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {coupon.startsAt
                        ? new Date(coupon.startsAt).toLocaleDateString()
                        : "Immediately"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      to{" "}
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString()
                        : "no expiry"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={coupon.isActive ? "success" : "default"}
                      label={coupon.isActive ? "Active" : "Archived"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit coupon">
                      <IconButton
                        aria-label={`Edit ${coupon.code}`}
                        onClick={() => openEdit(coupon)}
                      >
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Archive coupon">
                      <span>
                        <IconButton
                          aria-label={`Archive ${coupon.code}`}
                          disabled={!coupon.isActive}
                          onClick={() => void archive(coupon)}
                        >
                          <ArchiveOutlined />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}

      <Dialog
        open={dialogOpen}
        onClose={() => !saving && setDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{editingId ? "Edit coupon" : "New coupon"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                required
                label="Code"
                value={form.code}
                onChange={(event) =>
                  setForm({ ...form, code: event.target.value.toUpperCase() })
                }
                inputProps={{ pattern: "[A-Z0-9_-]+" }}
                fullWidth
              />
              <TextField
                select
                label="Discount type"
                value={form.discountType}
                onChange={(event) =>
                  setForm({
                    ...form,
                    discountType: event.target.value as "percentage" | "fixed",
                  })
                }
                fullWidth
              >
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="fixed">Fixed amount</MenuItem>
              </TextField>
              <TextField
                required
                type="number"
                label="Discount value"
                value={form.discountValue}
                onChange={(event) =>
                  setForm({ ...form, discountValue: event.target.value })
                }
                inputProps={{ min: 0.01, step: "0.01" }}
                fullWidth
              />
            </Stack>
            <TextField
              label="Description"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              multiline
              minRows={2}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                type="number"
                label="Minimum order amount"
                value={form.minOrderAmount}
                onChange={(event) =>
                  setForm({ ...form, minOrderAmount: event.target.value })
                }
                inputProps={{ min: 0.01, step: "0.01" }}
                fullWidth
              />
              <TextField
                type="number"
                label="Maximum discount"
                value={form.maxDiscountAmount}
                onChange={(event) =>
                  setForm({ ...form, maxDiscountAmount: event.target.value })
                }
                inputProps={{ min: 0.01, step: "0.01" }}
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                select
                label="Scope"
                value={form.scope}
                onChange={(event) =>
                  setForm({
                    ...form,
                    scope: event.target.value as "all" | "category" | "product",
                  })
                }
                fullWidth
              >
                <MenuItem value="all">Entire order</MenuItem>
                <MenuItem value="category">Categories</MenuItem>
                <MenuItem value="product">Products</MenuItem>
              </TextField>
              <TextField
                label="Scope IDs"
                value={form.scopeIds}
                onChange={(event) =>
                  setForm({ ...form, scopeIds: event.target.value })
                }
                disabled={form.scope === "all"}
                helperText="Comma-separated IDs"
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                type="number"
                label="Total usage limit"
                value={form.usageLimit}
                onChange={(event) =>
                  setForm({ ...form, usageLimit: event.target.value })
                }
                inputProps={{ min: 1 }}
                fullWidth
              />
              <TextField
                type="number"
                label="Usage per customer"
                value={form.usagePerUser}
                onChange={(event) =>
                  setForm({ ...form, usagePerUser: event.target.value })
                }
                inputProps={{ min: 1 }}
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                type="datetime-local"
                label="Starts at"
                value={form.startsAt}
                onChange={(event) =>
                  setForm({ ...form, startsAt: event.target.value })
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                type="datetime-local"
                label="Expires at"
                value={form.expiresAt}
                onChange={(event) =>
                  setForm({ ...form, expiresAt: event.target.value })
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm({ ...form, isActive: event.target.checked })
                  }
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => void save()}
            disabled={
              saving ||
              !form.code ||
              !form.discountValue ||
              (form.scope !== "all" && !form.scopeIds.trim())
            }
          >
            {saving ? "Saving…" : "Save coupon"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

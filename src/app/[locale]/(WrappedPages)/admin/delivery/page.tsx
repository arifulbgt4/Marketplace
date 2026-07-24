"use client";

import {
  AddOutlined,
  ArchiveOutlined,
  EditOutlined,
  LocalShippingOutlined,
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
  IconButton,
  Paper,
  Stack,
  Switch,
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

type DeliveryMethod = {
  id: string;
  name: string;
  code: string;
  carrier: string | null;
  price: string | number;
  freeShippingAbove: string | number | null;
  estimatedDaysMin: number | null;
  estimatedDaysMax: number | null;
  isActive: boolean;
};

type DeliveryZone = {
  id: string;
  name: string;
  slug: string;
  countries: string[];
  regions: string[];
  postalCodes: string[];
  priority: number;
  isActive: boolean;
  methods: DeliveryMethod[];
  warnings: string[];
};

type DeliveryPreview = {
  eligible: boolean;
  message?: string;
  zone?: { id: string; name: string };
  methods: Array<{
    id: string;
    name: string;
    cost: number;
    estimatedDaysMin: number | null;
    estimatedDaysMax: number | null;
  }>;
};

const emptyZone = {
  name: "",
  slug: "",
  countries: "",
  regions: "",
  postalCodes: "",
  priority: 0,
  isActive: true,
};

const emptyMethod = {
  zoneId: "",
  name: "",
  code: "",
  carrier: "",
  price: "",
  freeShippingAbove: "",
  estimatedDaysMin: "",
  estimatedDaysMax: "",
  isActive: true,
};

const parseCsv = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function DeliveryAdminPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [zoneDialog, setZoneDialog] = useState(false);
  const [methodDialog, setMethodDialog] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState("");
  const [zoneForm, setZoneForm] = useState(emptyZone);
  const [methodForm, setMethodForm] = useState(emptyMethod);
  const [previewing, setPreviewing] = useState(false);
  const [preview, setPreview] = useState<DeliveryPreview | null>(null);
  const [previewForm, setPreviewForm] = useState({
    country: "BD",
    region: "",
    postalCode: "",
    subtotal: "50",
    weightGrams: "500",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setZones(await adminRequest<DeliveryZone[]>("/api/admin/delivery/zones"));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load delivery zones",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreateZone() {
    setEditingZoneId("");
    setZoneForm(emptyZone);
    setZoneDialog(true);
  }

  function openEditZone(zone: DeliveryZone) {
    setEditingZoneId(zone.id);
    setZoneForm({
      name: zone.name,
      slug: zone.slug,
      countries: zone.countries.join(", "),
      regions: zone.regions.join(", "),
      postalCodes: zone.postalCodes.join(", "),
      priority: zone.priority,
      isActive: zone.isActive,
    });
    setZoneDialog(true);
  }

  function openMethod(zoneId: string) {
    setMethodForm({ ...emptyMethod, zoneId });
    setMethodDialog(true);
  }

  async function saveZone() {
    setSaving(true);
    setError("");
    try {
      await adminRequest(
        editingZoneId
          ? `/api/admin/delivery/zones/${editingZoneId}`
          : "/api/admin/delivery/zones",
        {
          method: editingZoneId ? "PATCH" : "POST",
          body: JSON.stringify({
            name: zoneForm.name,
            slug: zoneForm.slug,
            countries: parseCsv(zoneForm.countries),
            regions: parseCsv(zoneForm.regions),
            postalCodes: parseCsv(zoneForm.postalCodes),
            priority: zoneForm.priority,
            isActive: zoneForm.isActive,
          }),
        },
      );
      setZoneDialog(false);
      setSuccess(
        editingZoneId ? "Delivery zone updated." : "Delivery zone created.",
      );
      await load();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save delivery zone",
      );
    } finally {
      setSaving(false);
    }
  }

  async function archiveZone(zone: DeliveryZone) {
    if (!window.confirm(`Archive delivery zone "${zone.name}"?`)) return;
    setError("");
    try {
      await adminRequest(`/api/admin/delivery/zones/${zone.id}`, {
        method: "DELETE",
      });
      setSuccess("Delivery zone archived.");
      await load();
    } catch (archiveError) {
      setError(
        archiveError instanceof Error
          ? archiveError.message
          : "Unable to archive delivery zone",
      );
    }
  }

  async function saveMethod() {
    setSaving(true);
    setError("");
    try {
      await adminRequest("/api/admin/delivery/methods", {
        method: "POST",
        body: JSON.stringify({
          zoneId: methodForm.zoneId,
          name: methodForm.name,
          code: methodForm.code,
          carrier: methodForm.carrier || null,
          price: Number(methodForm.price),
          freeShippingAbove: methodForm.freeShippingAbove
            ? Number(methodForm.freeShippingAbove)
            : null,
          estimatedDaysMin: methodForm.estimatedDaysMin
            ? Number(methodForm.estimatedDaysMin)
            : null,
          estimatedDaysMax: methodForm.estimatedDaysMax
            ? Number(methodForm.estimatedDaysMax)
            : null,
          isActive: methodForm.isActive,
        }),
      });
      setMethodDialog(false);
      setSuccess("Delivery method created.");
      await load();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save delivery method",
      );
    } finally {
      setSaving(false);
    }
  }

  async function previewRules() {
    setPreviewing(true);
    setError("");
    try {
      const params = new URLSearchParams({
        country: previewForm.country.trim().toUpperCase(),
        region: previewForm.region.trim(),
        postalCode: previewForm.postalCode.trim(),
        subtotal: previewForm.subtotal || "0",
        weightGrams: previewForm.weightGrams || "0",
      });
      const response = await fetch(`/api/delivery/zones?${params}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message ?? "Unable to preview delivery rules");
      }
      setPreview(data);
    } catch (previewError) {
      setPreview(null);
      setError(
        previewError instanceof Error
          ? previewError.message
          : "Unable to preview delivery rules",
      );
    } finally {
      setPreviewing(false);
    }
  }

  return (
    <Box>
      <AdminPageHeader
        title="Delivery"
        description="Configure location matching, rate priority, and customer delivery methods."
        action={
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={openCreateZone}
          >
            New zone
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
      {loading ? <AdminLoading label="Loading delivery rules…" /> : null}
      {!loading ? (
        <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
          <Typography variant="h6">Rule preview</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Test the same location, cart amount and weight rules used at
            checkout.
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ md: "flex-start" }}
          >
            <TextField
              label="Country code"
              value={previewForm.country}
              onChange={(event) =>
                setPreviewForm({
                  ...previewForm,
                  country: event.target.value,
                })
              }
              inputProps={{ maxLength: 2 }}
              required
              size="small"
            />
            <TextField
              label="Region"
              value={previewForm.region}
              onChange={(event) =>
                setPreviewForm({ ...previewForm, region: event.target.value })
              }
              size="small"
            />
            <TextField
              label="Postal code"
              value={previewForm.postalCode}
              onChange={(event) =>
                setPreviewForm({
                  ...previewForm,
                  postalCode: event.target.value,
                })
              }
              size="small"
            />
            <TextField
              label="Subtotal"
              type="number"
              value={previewForm.subtotal}
              onChange={(event) =>
                setPreviewForm({
                  ...previewForm,
                  subtotal: event.target.value,
                })
              }
              inputProps={{ min: 0, step: "0.01" }}
              size="small"
            />
            <TextField
              label="Weight (g)"
              type="number"
              value={previewForm.weightGrams}
              onChange={(event) =>
                setPreviewForm({
                  ...previewForm,
                  weightGrams: event.target.value,
                })
              }
              inputProps={{ min: 0, step: 1 }}
              size="small"
            />
            <Button
              variant="outlined"
              onClick={() => void previewRules()}
              disabled={
                previewing || previewForm.country.trim().length !== 2
              }
            >
              {previewing ? "Checking…" : "Preview"}
            </Button>
          </Stack>
          {preview ? (
            <Alert
              severity={preview.eligible ? "success" : "warning"}
              sx={{ mt: 2 }}
            >
              {preview.eligible
                ? `${preview.zone?.name}: ${preview.methods
                    .map(
                      (method) =>
                        `${method.name} (${method.cost.toFixed(2)})`,
                    )
                    .join(", ")}`
                : (preview.message ?? "No delivery method is eligible.")}
            </Alert>
          ) : null}
        </Paper>
      ) : null}
      {!loading && !error && zones.length === 0 ? (
        <AdminEmpty
          title="No delivery zones"
          description="Create a zone before adding customer delivery methods."
        />
      ) : null}
      {!loading && zones.length > 0 ? (
        <Stack spacing={2}>
          {zones.map((zone) => (
            <Paper key={zone.id} variant="outlined" sx={{ p: 2.5 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                gap={2}
              >
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h6">{zone.name}</Typography>
                    <Chip
                      size="small"
                      label={zone.isActive ? "Active" : "Archived"}
                    />
                    <Chip
                      size="small"
                      variant="outlined"
                      label={`Priority ${zone.priority}`}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {zone.countries.join(", ")}
                    {zone.regions.length
                      ? ` · Regions: ${zone.regions.join(", ")}`
                      : ""}
                  </Typography>
                  {zone.warnings?.map((warning) => (
                    <Alert
                      key={warning}
                      severity="warning"
                      sx={{ mt: 1, py: 0 }}
                    >
                      {warning}
                    </Alert>
                  ))}
                </Box>
                <Stack direction="row">
                  <Tooltip title="Add delivery method">
                    <IconButton
                      aria-label={`Add delivery method to ${zone.name}`}
                      onClick={() => openMethod(zone.id)}
                    >
                      <LocalShippingOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit zone">
                    <IconButton
                      aria-label={`Edit ${zone.name}`}
                      onClick={() => openEditZone(zone)}
                    >
                      <EditOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Archive zone">
                    <IconButton
                      aria-label={`Archive ${zone.name}`}
                      onClick={() => void archiveZone(zone)}
                    >
                      <ArchiveOutlined />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
              <DividerWithLabel label="Delivery methods" />
              {zone.methods.length === 0 ? (
                <Typography color="text.secondary">
                  No methods configured for this zone.
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 1.5,
                  }}
                >
                  {zone.methods.map((method) => (
                    <Paper
                      key={method.id}
                      variant="outlined"
                      sx={{ p: 2, bgcolor: "background.default" }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        gap={2}
                      >
                        <Box>
                          <Typography fontWeight={600}>
                            {method.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {method.carrier || method.code}
                          </Typography>
                        </Box>
                        <Typography fontWeight={700}>
                          {Number(method.price).toFixed(2)}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {method.estimatedDaysMin && method.estimatedDaysMax
                          ? `${method.estimatedDaysMin}–${method.estimatedDaysMax} days`
                          : "Delivery estimate not configured"}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </Paper>
          ))}
        </Stack>
      ) : null}

      <Dialog
        open={zoneDialog}
        onClose={() => !saving && setZoneDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingZoneId ? "Edit delivery zone" : "New delivery zone"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              required
              label="Name"
              value={zoneForm.name}
              onChange={(event) =>
                setZoneForm({ ...zoneForm, name: event.target.value })
              }
            />
            <TextField
              required
              label="Slug"
              value={zoneForm.slug}
              onChange={(event) =>
                setZoneForm({ ...zoneForm, slug: event.target.value })
              }
              helperText="Lowercase letters, numbers, and hyphens"
            />
            <TextField
              required
              label="Countries"
              value={zoneForm.countries}
              onChange={(event) =>
                setZoneForm({ ...zoneForm, countries: event.target.value })
              }
              helperText="Comma-separated country names or codes"
            />
            <TextField
              label="Regions"
              value={zoneForm.regions}
              onChange={(event) =>
                setZoneForm({ ...zoneForm, regions: event.target.value })
              }
              helperText="Optional comma-separated region names"
            />
            <TextField
              label="Postal codes"
              value={zoneForm.postalCodes}
              onChange={(event) =>
                setZoneForm({ ...zoneForm, postalCodes: event.target.value })
              }
              helperText="Optional comma-separated postal codes"
            />
            <TextField
              type="number"
              label="Priority"
              value={zoneForm.priority}
              onChange={(event) =>
                setZoneForm({
                  ...zoneForm,
                  priority: Number(event.target.value),
                })
              }
              inputProps={{ min: 0 }}
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Switch
                checked={zoneForm.isActive}
                onChange={(event) =>
                  setZoneForm({
                    ...zoneForm,
                    isActive: event.target.checked,
                  })
                }
              />
              <Typography>Active</Typography>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setZoneDialog(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => void saveZone()}
            disabled={
              saving || !zoneForm.name || !zoneForm.slug || !zoneForm.countries
            }
          >
            {saving ? "Saving…" : "Save zone"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={methodDialog}
        onClose={() => !saving && setMethodDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>New delivery method</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              required
              label="Name"
              value={methodForm.name}
              onChange={(event) =>
                setMethodForm({ ...methodForm, name: event.target.value })
              }
            />
            <TextField
              required
              label="Code"
              value={methodForm.code}
              onChange={(event) =>
                setMethodForm({ ...methodForm, code: event.target.value })
              }
            />
            <TextField
              label="Carrier"
              value={methodForm.carrier}
              onChange={(event) =>
                setMethodForm({ ...methodForm, carrier: event.target.value })
              }
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                required
                type="number"
                label="Price"
                value={methodForm.price}
                onChange={(event) =>
                  setMethodForm({ ...methodForm, price: event.target.value })
                }
                inputProps={{ min: 0, step: "0.01" }}
                fullWidth
              />
              <TextField
                type="number"
                label="Free above"
                value={methodForm.freeShippingAbove}
                onChange={(event) =>
                  setMethodForm({
                    ...methodForm,
                    freeShippingAbove: event.target.value,
                  })
                }
                inputProps={{ min: 0, step: "0.01" }}
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                type="number"
                label="Minimum days"
                value={methodForm.estimatedDaysMin}
                onChange={(event) =>
                  setMethodForm({
                    ...methodForm,
                    estimatedDaysMin: event.target.value,
                  })
                }
                inputProps={{ min: 1 }}
                fullWidth
              />
              <TextField
                type="number"
                label="Maximum days"
                value={methodForm.estimatedDaysMax}
                onChange={(event) =>
                  setMethodForm({
                    ...methodForm,
                    estimatedDaysMax: event.target.value,
                  })
                }
                inputProps={{ min: 1 }}
                fullWidth
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMethodDialog(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => void saveMethod()}
            disabled={
              saving ||
              !methodForm.name ||
              !methodForm.code ||
              methodForm.price === ""
            }
          >
            {saving ? "Saving…" : "Create method"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function DividerWithLabel({ label }: { label: string }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2} my={2}>
      <Box sx={{ height: 1, bgcolor: "divider", flex: 1 }} />
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Box sx={{ height: 1, bgcolor: "divider", flex: 1 }} />
    </Stack>
  );
}

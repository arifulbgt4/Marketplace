"use client";

import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, useCallback, useEffect, useState } from "react";

import {
  AdminError,
  AdminLoading,
  AdminPageHeader,
  adminRequest,
} from "src/components/Admin";

type CodSettings = {
  enabled: boolean;
  minimumOrderAmount: number | null;
  maximumOrderAmount: number | null;
  allowedZoneIds: string[];
  blockedZoneIds: string[];
  blockedProductIds: string[];
  blockedCategoryIds: string[];
  maximumItemQuantity: number | null;
  requireVerifiedPhone: boolean;
  collectionInstructions: string;
  ruleVersion?: string;
};

type CodPreviewResult = {
  eligible: boolean;
  reasonCode: string | null;
  ruleVersion: string;
  evaluatedAt: string;
};

const emptySettings: CodSettings = {
  enabled: false,
  minimumOrderAmount: null,
  maximumOrderAmount: null,
  allowedZoneIds: [],
  blockedZoneIds: [],
  blockedProductIds: [],
  blockedCategoryIds: [],
  maximumItemQuantity: null,
  requireVerifiedPhone: false,
  collectionInstructions: "",
};

function unwrap(response: CodSettings | { value: CodSettings }): CodSettings {
  return "value" in response ? response.value : response;
}

function csv(values: string[]) {
  return values.join(", ");
}

function parseCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function CodSettingsPage() {
  const [settings, setSettings] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewing, setPreviewing] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewResult, setPreviewResult] =
    useState<CodPreviewResult | null>(null);
  const [previewForm, setPreviewForm] = useState({
    customerId: "",
    subtotal: "50",
    currency: "USD",
    country: "BD",
    region: "",
    postalCode: "",
    items:
      '[\n  {\n    "productId": "00000000-0000-4000-8000-000000000001",\n    "categoryId": null,\n    "quantity": 1\n  }\n]',
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminRequest<CodSettings | { value: CodSettings }>(
        "/api/admin/settings/cod",
      );
      setSettings({ ...emptySettings, ...unwrap(response) });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load COD settings",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await adminRequest<CodSettings | { value: CodSettings }>(
        "/api/admin/settings/cod",
        {
          method: "PATCH",
          body: JSON.stringify(settings),
        },
      );
      setSettings({ ...emptySettings, ...unwrap(response) });
      setSuccess("Cash on Delivery settings saved.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save COD settings",
      );
    } finally {
      setSaving(false);
    }
  }

  async function previewRules() {
    setPreviewing(true);
    setPreviewError("");
    setPreviewResult(null);
    try {
      const result = await adminRequest<CodPreviewResult>(
        "/api/admin/settings/cod/preview",
        {
          method: "POST",
          body: JSON.stringify({
            userId: previewForm.customerId.trim() || undefined,
            subtotal: Number(previewForm.subtotal),
            currency: previewForm.currency.trim().toUpperCase(),
            country: previewForm.country.trim().toUpperCase(),
            region: previewForm.region.trim() || undefined,
            postalCode: previewForm.postalCode.trim() || undefined,
            items: JSON.parse(previewForm.items),
          }),
        },
      );
      setPreviewResult(result);
    } catch (previewFailure) {
      setPreviewError(
        previewFailure instanceof Error
          ? previewFailure.message
          : "Unable to preview COD eligibility",
      );
    } finally {
      setPreviewing(false);
    }
  }

  return (
    <Box>
      <AdminPageHeader
        title="Cash on Delivery"
        description="Configure COD eligibility. Checkout always performs authoritative server-side evaluation."
      />
      {loading ? <AdminLoading label="Loading COD rules…" /> : null}
      {!loading && error ? (
        <Box mb={2}>
          <AdminError message={error} retry={load} />
        </Box>
      ) : null}
      {success ? (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      ) : null}
      {!loading ? (
        <Stack spacing={2} sx={{ maxWidth: 900 }}>
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6">Eligibility preview</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Evaluate the same authoritative rule engine used by checkout.
              Add a customer ID when testing the verified-phone rule.
            </Typography>
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="Customer ID (optional)"
                  value={previewForm.customerId}
                  onChange={(event) =>
                    setPreviewForm({
                      ...previewForm,
                      customerId: event.target.value,
                    })
                  }
                  fullWidth
                />
                <TextField
                  type="number"
                  label="Order total"
                  value={previewForm.subtotal}
                  onChange={(event) =>
                    setPreviewForm({
                      ...previewForm,
                      subtotal: event.target.value,
                    })
                  }
                  inputProps={{ min: 0, step: "0.01" }}
                  fullWidth
                />
                <TextField
                  label="Currency"
                  value={previewForm.currency}
                  onChange={(event) =>
                    setPreviewForm({
                      ...previewForm,
                      currency: event.target.value,
                    })
                  }
                  inputProps={{ maxLength: 3 }}
                  fullWidth
                />
              </Stack>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
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
                  fullWidth
                />
                <TextField
                  label="Region"
                  value={previewForm.region}
                  onChange={(event) =>
                    setPreviewForm({
                      ...previewForm,
                      region: event.target.value,
                    })
                  }
                  fullWidth
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
                  fullWidth
                />
              </Stack>
              <TextField
                label="Cart items JSON"
                value={previewForm.items}
                onChange={(event) =>
                  setPreviewForm({ ...previewForm, items: event.target.value })
                }
                multiline
                minRows={5}
                helperText="Each item requires productId, nullable categoryId and quantity."
              />
              {previewError ? (
                <Alert severity="error">{previewError}</Alert>
              ) : null}
              {previewResult ? (
                <Alert
                  severity={previewResult.eligible ? "success" : "warning"}
                >
                  {previewResult.eligible
                    ? `Eligible under rule ${previewResult.ruleVersion}.`
                    : `Not eligible: ${previewResult.reasonCode}.`}
                </Alert>
              ) : null}
              <Box>
                <Button
                  variant="outlined"
                  onClick={() => void previewRules()}
                  disabled={
                    previewing ||
                    previewForm.country.trim().length !== 2 ||
                    !previewForm.subtotal
                  }
                >
                  {previewing ? "Checking…" : "Preview eligibility"}
                </Button>
              </Box>
            </Stack>
          </Paper>
          <Paper
            component="form"
            onSubmit={save}
            variant="outlined"
            sx={{ p: { xs: 2, md: 3 } }}
          >
            <Stack spacing={2.5}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              gap={2}
            >
              <Box>
                <Typography variant="h6">COD availability</Typography>
                <Typography variant="body2" color="text.secondary">
                  Disabling COD removes it from new checkout sessions.
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enabled}
                    onChange={(event) =>
                      setSettings({
                        ...settings,
                        enabled: event.target.checked,
                      })
                    }
                  />
                }
                label={settings.enabled ? "Enabled" : "Disabled"}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                type="number"
                label="Minimum order amount"
                value={settings.minimumOrderAmount ?? ""}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    minimumOrderAmount:
                      event.target.value === ""
                        ? null
                        : Number(event.target.value),
                  })
                }
                inputProps={{ min: 0, step: "0.01" }}
                fullWidth
              />
              <TextField
                type="number"
                label="Maximum order amount"
                value={settings.maximumOrderAmount ?? ""}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    maximumOrderAmount:
                      event.target.value === ""
                        ? null
                        : Number(event.target.value),
                  })
                }
                inputProps={{ min: 0, step: "0.01" }}
                fullWidth
              />
              <TextField
                type="number"
                label="Maximum item quantity"
                value={settings.maximumItemQuantity ?? ""}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    maximumItemQuantity:
                      event.target.value === ""
                        ? null
                        : Number(event.target.value),
                  })
                }
                inputProps={{ min: 1, step: 1 }}
                fullWidth
              />
            </Stack>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.requireVerifiedPhone}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      requireVerifiedPhone: event.target.checked,
                    })
                  }
                />
              }
              label="Require a verified customer phone"
            />
            <TextField
              label="Allowed delivery zone IDs"
              value={csv(settings.allowedZoneIds)}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  allowedZoneIds: parseCsv(event.target.value),
                })
              }
              helperText="Comma-separated. Leave empty to allow any zone not explicitly blocked."
            />
            <TextField
              label="Blocked delivery zone IDs"
              value={csv(settings.blockedZoneIds)}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  blockedZoneIds: parseCsv(event.target.value),
                })
              }
              helperText="Deny rules take precedence over allow rules."
            />
            <TextField
              label="Blocked product IDs"
              value={csv(settings.blockedProductIds)}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  blockedProductIds: parseCsv(event.target.value),
                })
              }
              helperText="Comma-separated product IDs."
            />
            <TextField
              label="Blocked category IDs"
              value={csv(settings.blockedCategoryIds)}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  blockedCategoryIds: parseCsv(event.target.value),
                })
              }
              helperText="Comma-separated category IDs."
            />
            <TextField
              label="Collection instructions"
              value={settings.collectionInstructions}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  collectionInstructions: event.target.value,
                })
              }
              multiline
              minRows={3}
              inputProps={{ maxLength: 1000 }}
            />
            {settings.ruleVersion !== undefined ? (
              <Typography variant="caption" color="text.secondary">
                Current rule version: {settings.ruleVersion}
              </Typography>
            ) : null}
            <Box>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Saving…" : "Save COD rules"}
              </Button>
            </Box>
            </Stack>
          </Paper>
        </Stack>
      ) : null}
    </Box>
  );
}

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

type MethodSetting = {
  enabled: boolean;
  label: string;
  description: string | null;
};

type PaymentSettings = {
  cashOnDelivery: MethodSetting;
  onlinePayment: MethodSetting & { provider: string | null };
};

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setSettings(
        await adminRequest<PaymentSettings>("/api/admin/settings/payments"),
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load payment settings",
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
    if (!settings) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      setSettings(
        await adminRequest<PaymentSettings>("/api/admin/settings/payments", {
          method: "PATCH",
          body: JSON.stringify(settings),
        }),
      );
      setSuccess("Payment settings saved.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save payment settings",
      );
    } finally {
      setSaving(false);
    }
  }

  function update<K extends keyof PaymentSettings>(
    key: K,
    patch: Partial<PaymentSettings[K]>,
  ) {
    if (!settings) return;
    setSettings({
      ...settings,
      [key]: { ...settings[key], ...patch },
    });
  }

  return (
    <Box>
      <AdminPageHeader
        title="Payment methods"
        description="Control customer-visible payment methods. Provider secrets remain environment-managed."
      />
      {loading ? <AdminLoading label="Loading payment methods…" /> : null}
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
      {!loading && settings ? (
        <Stack
          component="form"
          onSubmit={save}
          spacing={2}
          sx={{ maxWidth: 820 }}
        >
          <PaymentMethodCard
            title="Cash on Delivery"
            method={settings.cashOnDelivery}
            onChange={(patch) => update("cashOnDelivery", patch)}
          />
          <PaymentMethodCard
            title="Online payment"
            method={settings.onlinePayment}
            provider={settings.onlinePayment.provider}
            onChange={(patch) => update("onlinePayment", patch)}
          />
          <Box>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "Saving…" : "Save payment methods"}
            </Button>
          </Box>
        </Stack>
      ) : null}
    </Box>
  );
}

function PaymentMethodCard({
  title,
  method,
  provider,
  onChange,
}: {
  title: string;
  method: MethodSetting;
  provider?: string | null;
  onChange: (patch: Partial<MethodSetting>) => void;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        gap={2}
      >
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography color="text.secondary" variant="body2">
            {method.description || "No customer description configured"}
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={method.enabled}
              onChange={(event) => onChange({ enabled: event.target.checked })}
            />
          }
          label={method.enabled ? "Enabled" : "Disabled"}
        />
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
        <TextField
          required
          label="Customer-facing label"
          value={method.label}
          onChange={(event) => onChange({ label: event.target.value })}
          fullWidth
        />
        <TextField
          label="Description"
          value={method.description ?? ""}
          onChange={(event) =>
            onChange({ description: event.target.value || null })
          }
          fullWidth
        />
        {provider !== undefined ? (
          <TextField
            label="Provider"
            value={provider ?? ""}
            InputProps={{ readOnly: true }}
            fullWidth
          />
        ) : null}
      </Stack>
    </Paper>
  );
}

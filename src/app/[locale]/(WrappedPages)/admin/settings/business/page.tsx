"use client";

import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { FormEvent, useCallback, useEffect, useState } from "react";

import {
  AdminError,
  AdminLoading,
  AdminPageHeader,
  adminRequest,
} from "src/components/Admin";

type BusinessSettings = {
  displayName: string;
  legalName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  defaultCurrency: string;
  defaultLocale: string;
  timezone: string;
};

const emptySettings: BusinessSettings = {
  displayName: "",
  legalName: "",
  supportEmail: "",
  supportPhone: "",
  address: "",
  defaultCurrency: "",
  defaultLocale: "",
  timezone: "",
};

function unwrap(
  response:
    | (Omit<
        BusinessSettings,
        "legalName" | "supportEmail" | "supportPhone" | "address"
      > & {
        legalName: string | null;
        supportEmail: string | null;
        supportPhone: string | null;
        address: string | null;
      })
    | { value: BusinessSettings },
): BusinessSettings {
  const value = "value" in response ? response.value : response;
  return {
    ...value,
    legalName: value.legalName ?? "",
    supportEmail: value.supportEmail ?? "",
    supportPhone: value.supportPhone ?? "",
    address: value.address ?? "",
  };
}

export default function BusinessSettingsPage() {
  const [settings, setSettings] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminRequest<Parameters<typeof unwrap>[0]>(
        "/api/admin/settings/business",
      );
      setSettings({ ...emptySettings, ...unwrap(response) });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load business settings",
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
      const response = await adminRequest<Parameters<typeof unwrap>[0]>(
        "/api/admin/settings/business",
        {
          method: "PATCH",
          body: JSON.stringify({
            ...settings,
            legalName: settings.legalName || null,
            supportEmail: settings.supportEmail || null,
            supportPhone: settings.supportPhone || null,
            address: settings.address || null,
          }),
        },
      );
      setSettings({ ...emptySettings, ...unwrap(response) });
      setSuccess("Business settings saved.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save business settings",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box>
      <AdminPageHeader
        title="Business settings"
        description="Configure the business identity and operational defaults shown across the marketplace."
      />
      {loading ? <AdminLoading label="Loading business settings…" /> : null}
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
        <Paper
          component="form"
          onSubmit={save}
          variant="outlined"
          sx={{ p: { xs: 2, md: 3 }, maxWidth: 820 }}
        >
          <Stack spacing={2.5}>
            <TextField
              required
              label="Business name"
              value={settings.displayName}
              onChange={(event) =>
                setSettings({ ...settings, displayName: event.target.value })
              }
            />
            <TextField
              label="Legal business name"
              value={settings.legalName}
              onChange={(event) =>
                setSettings({ ...settings, legalName: event.target.value })
              }
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                required
                type="email"
                label="Support email"
                value={settings.supportEmail}
                onChange={(event) =>
                  setSettings({ ...settings, supportEmail: event.target.value })
                }
                fullWidth
              />
              <TextField
                label="Support phone"
                value={settings.supportPhone}
                onChange={(event) =>
                  setSettings({ ...settings, supportPhone: event.target.value })
                }
                fullWidth
              />
            </Stack>
            <TextField
              label="Business address"
              value={settings.address}
              onChange={(event) =>
                setSettings({ ...settings, address: event.target.value })
              }
              multiline
              minRows={3}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                required
                label="Default currency"
                value={settings.defaultCurrency}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    defaultCurrency: event.target.value.toUpperCase(),
                  })
                }
                inputProps={{ maxLength: 3 }}
                helperText="ISO 4217 code, for example USD or BDT"
                fullWidth
              />
              <TextField
                select
                required
                label="Default locale"
                value={settings.defaultLocale}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    defaultLocale: event.target.value,
                  })
                }
                fullWidth
              >
                {["en", "bn", "ar", "de", "es", "fr", "he", "zh"].map(
                  (locale) => (
                    <MenuItem key={locale} value={locale}>
                      {locale}
                    </MenuItem>
                  ),
                )}
              </TextField>
            </Stack>
            <TextField
              required
              label="Timezone"
              value={settings.timezone}
              onChange={(event) =>
                setSettings({ ...settings, timezone: event.target.value })
              }
              helperText="IANA timezone, for example Asia/Dhaka"
            />
            <Box>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Saving…" : "Save settings"}
              </Button>
            </Box>
          </Stack>
        </Paper>
      ) : null}
    </Box>
  );
}

"use client";

import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
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

type BrandingSettings = {
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  seoTitle: string;
  seoDescription: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedInUrl: string;
};

type BrandingResponse = {
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  seoTitle: string | null;
  seoDescription: string | null;
  socialLinks: {
    facebook?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
  };
};

const emptySettings: BrandingSettings = {
  logoUrl: "",
  faviconUrl: "",
  primaryColor: "#1976d2",
  secondaryColor: "#9c27b0",
  seoTitle: "",
  seoDescription: "",
  facebookUrl: "",
  instagramUrl: "",
  linkedInUrl: "",
};

function unwrap(
  response: BrandingResponse | { value: BrandingResponse },
): BrandingSettings {
  const value = "value" in response ? response.value : response;
  return {
    logoUrl: value.logoUrl ?? "",
    faviconUrl: value.faviconUrl ?? "",
    primaryColor: value.primaryColor,
    secondaryColor: value.secondaryColor,
    seoTitle: value.seoTitle ?? "",
    seoDescription: value.seoDescription ?? "",
    facebookUrl: value.socialLinks.facebook ?? "",
    instagramUrl: value.socialLinks.instagram ?? "",
    linkedInUrl: value.socialLinks.linkedin ?? "",
  };
}

export default function BrandingSettingsPage() {
  const [settings, setSettings] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminRequest<
        BrandingResponse | { value: BrandingResponse }
      >("/api/admin/settings/branding");
      setSettings({ ...emptySettings, ...unwrap(response) });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load branding settings",
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
      const response = await adminRequest<
        BrandingResponse | { value: BrandingResponse }
      >("/api/admin/settings/branding", {
        method: "PATCH",
        body: JSON.stringify({
          logoUrl: settings.logoUrl || null,
          faviconUrl: settings.faviconUrl || null,
          primaryColor: settings.primaryColor,
          secondaryColor: settings.secondaryColor,
          seoTitle: settings.seoTitle || null,
          seoDescription: settings.seoDescription || null,
          socialLinks: {
            facebook: settings.facebookUrl || null,
            instagram: settings.instagramUrl || null,
            linkedin: settings.linkedInUrl || null,
          },
        }),
      });
      setSettings({ ...emptySettings, ...unwrap(response) });
      setSuccess("Branding settings saved.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save branding settings",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box>
      <AdminPageHeader
        title="Branding"
        description="Manage business identity tokens without changing the protected homepage Hero and Search composition."
      />
      {loading ? <AdminLoading label="Loading branding settings…" /> : null}
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
        <Stack
          component="form"
          onSubmit={save}
          direction={{ xs: "column", lg: "row" }}
          alignItems="flex-start"
          spacing={3}
        >
          <Paper
            variant="outlined"
            sx={{ p: { xs: 2, md: 3 }, width: "100%", maxWidth: 760 }}
          >
            <Stack spacing={2.5}>
              <TextField
                label="Logo URL"
                type="url"
                value={settings.logoUrl}
                onChange={(event) =>
                  setSettings({ ...settings, logoUrl: event.target.value })
                }
              />
              <TextField
                label="Favicon URL"
                type="url"
                value={settings.faviconUrl}
                onChange={(event) =>
                  setSettings({ ...settings, faviconUrl: event.target.value })
                }
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Primary color"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      primaryColor: event.target.value,
                    })
                  }
                  fullWidth
                />
                <TextField
                  label="Secondary color"
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      secondaryColor: event.target.value,
                    })
                  }
                  fullWidth
                />
              </Stack>
              <TextField
                label="Default SEO title"
                value={settings.seoTitle}
                onChange={(event) =>
                  setSettings({ ...settings, seoTitle: event.target.value })
                }
                inputProps={{ maxLength: 70 }}
              />
              <TextField
                label="Default SEO description"
                value={settings.seoDescription}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    seoDescription: event.target.value,
                  })
                }
                multiline
                minRows={3}
                inputProps={{ maxLength: 170 }}
              />
              <TextField
                label="Facebook URL"
                type="url"
                value={settings.facebookUrl}
                onChange={(event) =>
                  setSettings({ ...settings, facebookUrl: event.target.value })
                }
              />
              <TextField
                label="Instagram URL"
                type="url"
                value={settings.instagramUrl}
                onChange={(event) =>
                  setSettings({ ...settings, instagramUrl: event.target.value })
                }
              />
              <TextField
                label="LinkedIn URL"
                type="url"
                value={settings.linkedInUrl}
                onChange={(event) =>
                  setSettings({ ...settings, linkedInUrl: event.target.value })
                }
              />
              <Box>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? "Saving…" : "Save branding"}
                </Button>
              </Box>
            </Stack>
          </Paper>
          <Paper
            variant="outlined"
            aria-label="Brand preview"
            sx={{ p: 3, width: { xs: "100%", lg: 320 } }}
          >
            <Typography variant="overline" color="text.secondary">
              Preview
            </Typography>
            {settings.logoUrl ? (
              <Box
                component="img"
                src={settings.logoUrl}
                alt="Configured business logo preview"
                sx={{
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: 96,
                  objectFit: "contain",
                  my: 2,
                }}
              />
            ) : (
              <Typography color="text.secondary" my={2}>
                No logo configured
              </Typography>
            )}
            <Stack direction="row" spacing={1} mb={2}>
              <Box
                aria-label={`Primary color ${settings.primaryColor}`}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                  bgcolor: settings.primaryColor,
                }}
              />
              <Box
                aria-label={`Secondary color ${settings.secondaryColor}`}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                  bgcolor: settings.secondaryColor,
                }}
              />
            </Stack>
            <Typography fontWeight={700}>
              {settings.seoTitle || "SEO title not configured"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              {settings.seoDescription || "SEO description not configured"}
            </Typography>
          </Paper>
        </Stack>
      ) : null}
    </Box>
  );
}

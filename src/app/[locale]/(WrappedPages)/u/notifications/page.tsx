"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { formatDateTime } from "src/lib/i18n";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
};

type Preferences = {
  emailTransactional: boolean;
  emailMarketing: boolean;
  inAppTransactional: boolean;
  inAppMarketing: boolean;
};

const defaultPreferences: Preferences = {
  emailTransactional: true,
  emailMarketing: false,
  inAppTransactional: true,
  inAppMarketing: false,
};

export default function CustomerNotificationsPage() {
  const locale = useLocale();
  const t = useTranslations("Notifications");
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [notificationsResponse, preferencesResponse] = await Promise.all([
        fetch("/api/notifications?limit=50", { cache: "no-store" }),
        fetch("/api/notifications/preferences", { cache: "no-store" }),
      ]);
      const notifications = await notificationsResponse.json();
      const preferenceData = await preferencesResponse.json();
      if (!notificationsResponse.ok) {
        throw new Error(notifications.message ?? t("loadError"));
      }
      if (!preferencesResponse.ok) {
        throw new Error(preferenceData.message ?? t("preferencesLoadError"));
      }
      setItems(notifications.items ?? []);
      setUnreadCount(notifications.unreadCount ?? 0);
      setPreferences(preferenceData);
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : t("loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function markRead(id: string) {
    const response = await fetch(`/api/notifications/${id}/read`, {
      method: "PATCH",
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message ?? t("markReadError"));
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, readAt: data.readAt } : item,
      ),
    );
    setUnreadCount((count) => Math.max(0, count - 1));
  }

  async function markAllRead() {
    const response = await fetch("/api/notifications/read-all", {
      method: "PATCH",
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message ?? t("markReadError"));
      return;
    }
    setItems((current) =>
      current.map((item) => ({ ...item, readAt: item.readAt ?? data.readAt })),
    );
    setUnreadCount(0);
  }

  async function updateMarketing(
    field: "emailMarketing" | "inAppMarketing",
    enabled: boolean,
  ) {
    setSavingPreferences(true);
    setError("");
    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ [field]: enabled }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message ?? t("saveError"));
      }
      setPreferences(data);
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : t("saveError"));
    } finally {
      setSavingPreferences(false);
    }
  }

  return (
    <Stack spacing={3} py={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
      >
        <Box>
          <Typography variant="h3">{t("title")}</Typography>
          <Typography color="text.secondary">{t("description")}</Typography>
        </Box>
        <Button
          variant="outlined"
          disabled={unreadCount === 0}
          onClick={() => void markAllRead()}
        >
          {t("markAllRead")}
        </Button>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">{t("preferences")}</Typography>
        <Typography color="text.secondary" mb={2}>
          {t("preferencesDescription")}
        </Typography>
        <Stack>
          <FormControlLabel
            control={<Switch checked disabled />}
            label={t("emailTransactional")}
          />
          <FormControlLabel
            control={<Switch checked disabled />}
            label={t("inAppTransactional")}
          />
          <FormControlLabel
            control={
              <Switch
                checked={preferences.emailMarketing}
                disabled={savingPreferences}
                onChange={(_, checked) =>
                  void updateMarketing("emailMarketing", checked)
                }
              />
            }
            label={t("emailMarketing")}
          />
          <FormControlLabel
            control={
              <Switch
                checked={preferences.inAppMarketing}
                disabled={savingPreferences}
                onChange={(_, checked) =>
                  void updateMarketing("inAppMarketing", checked)
                }
              />
            }
            label={t("inAppMarketing")}
          />
        </Stack>
      </Paper>

      <Divider />

      {loading ? (
        <Stack alignItems="center" py={6}>
          <CircularProgress aria-label={t("loading")} />
        </Stack>
      ) : items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6">{t("empty")}</Typography>
          <Typography color="text.secondary">
            {t("emptyDescription")}
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {items.map((item) => (
            <Paper
              key={item.id}
              sx={{
                p: 3,
                borderLeft: 4,
                borderColor: item.readAt ? "divider" : "primary.main",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                gap={2}
              >
                <Box>
                  <Stack direction="row" gap={1} alignItems="center" mb={0.5}>
                    <Typography variant="h6">{item.title}</Typography>
                    {!item.readAt ? (
                      <Chip size="small" color="primary" label={t("new")} />
                    ) : null}
                  </Stack>
                  <Typography>{item.message}</Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {formatDateTime(item.createdAt, locale)}
                  </Typography>
                </Box>
                {!item.readAt ? (
                  <Button
                    size="small"
                    onClick={() => void markRead(item.id)}
                    sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
                  >
                    {t("markRead")}
                  </Button>
                ) : null}
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

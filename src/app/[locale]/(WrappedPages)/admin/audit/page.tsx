"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type AuditEntry = {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata: unknown;
  createdAt: string;
  actor: { name: string; email: string } | null;
};

export default function AdminAuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [action, setAction] = useState("");
  const [targetType, setTargetType] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const query = new URLSearchParams({ limit: "100" });
    if (action) query.set("action", action);
    if (targetType) query.set("targetType", targetType);
    const response = await fetch(`/api/admin/audit?${query}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message ?? "Unable to load audit log");
    setEntries(data.entries ?? []);
  }, [action, targetType]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      load().catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load audit log",
        ),
      );
    }, 200);
    return () => window.clearTimeout(timer);
  }, [load]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Audit log</Typography>
        <Typography color="text.secondary">
          Immutable security and operational activity.
        </Typography>
      </Box>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          size="small"
          label="Action contains"
          value={action}
          onChange={(event) => setAction(event.target.value)}
        />
        <TextField
          size="small"
          label="Target type"
          value={targetType}
          onChange={(event) => setTargetType(event.target.value)}
        />
      </Stack>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {entries.map((entry) => (
        <Paper key={entry.id} sx={{ p: 2 }}>
          <Typography fontWeight={600}>{entry.action}</Typography>
          <Typography variant="body2">
            {entry.targetType} · {entry.targetId}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {entry.actor
              ? `${entry.actor.name} (${entry.actor.email})`
              : "System"}{" "}
            · {new Date(entry.createdAt).toLocaleString()}
          </Typography>
          <Typography
            component="pre"
            variant="caption"
            sx={{ whiteSpace: "pre-wrap", mt: 1 }}
          >
            {JSON.stringify(entry.metadata, null, 2)}
          </Typography>
        </Paper>
      ))}
      {!entries.length && !error ? (
        <Paper sx={{ p: 3 }}>No matching audit entries.</Paper>
      ) : null}
    </Stack>
  );
}

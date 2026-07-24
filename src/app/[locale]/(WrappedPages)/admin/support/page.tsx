"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

type Staff = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type SupportRequestSummary = {
  id: string;
  reference: string;
  source: string;
  status: string;
  priority: string;
  subject: string;
  name: string;
  email: string;
  version: number;
  createdAt: string;
  assignedTo: Staff | null;
};

type SupportRequestDetail = SupportRequestSummary & {
  phone: string | null;
  message: string;
  context: Record<string, unknown>;
  internalNote: string | null;
  resolvedAt: string | null;
  updatedAt: string;
};

type ListResponse = {
  requests: SupportRequestSummary[];
  assignees: Staff[];
  pagination: { total: number };
};

const STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_FOR_CUSTOMER",
  "RESOLVED",
  "CLOSED",
] as const;
const PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;

async function readResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => ({}))) as T & {
    message?: string;
  };
  if (!response.ok) {
    throw new Error(data.message || "Support request operation failed");
  }
  return data;
}

export default function AdminSupportPage() {
  const [requests, setRequests] = useState<SupportRequestSummary[]>([]);
  const [assignees, setAssignees] = useState<Staff[]>([]);
  const [selected, setSelected] = useState<SupportRequestDetail | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [draftStatus, setDraftStatus] = useState("");
  const [draftPriority, setDraftPriority] = useState("");
  const [draftAssignee, setDraftAssignee] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (search.trim()) params.set("search", search.trim());
    try {
      const response = await fetch(`/api/admin/support?${params.toString()}`);
      const data = await readResponse<ListResponse>(response);
      setRequests(data.requests);
      setAssignees(data.assignees);
    } catch (loadError: unknown) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load support requests",
      );
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const openRequest = async (id: string) => {
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/support/${id}`);
      const detail = await readResponse<SupportRequestDetail>(response);
      setSelected(detail);
      setDraftStatus(detail.status);
      setDraftPriority(detail.priority);
      setDraftAssignee(detail.assignedTo?.id ?? "");
      setDraftNote(detail.internalNote ?? "");
    } catch (detailError: unknown) {
      setError(
        detailError instanceof Error
          ? detailError.message
          : "Unable to load support request",
      );
    }
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/support/${selected.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          version: selected.version,
          status: draftStatus,
          priority: draftPriority,
          assignedToId: draftAssignee || null,
          internalNote: draftNote || null,
        }),
      });
      const detail = await readResponse<SupportRequestDetail>(response);
      setSelected(detail);
      setDraftStatus(detail.status);
      setDraftPriority(detail.priority);
      setDraftAssignee(detail.assignedTo?.id ?? "");
      setDraftNote(detail.internalNote ?? "");
      setNotice(`${detail.reference} was updated.`);
      await load();
    } catch (saveError: unknown) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update support request",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Support requests</Typography>
        <Typography color="text.secondary">
          Review customer contact requests and listing reports. Personal
          information is available only inside this staff workspace.
        </Typography>
      </Box>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {notice ? <Alert severity="success">{notice}</Alert> : null}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          size="small"
          label="Search reference, subject or customer"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ minWidth: { sm: 360 } }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <MenuItem value="">All statuses</MenuItem>
            {STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status.replaceAll("_", " ")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={() => void load()}>
          Refresh
        </Button>
      </Stack>

      <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
        <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <CircularProgress size={28} />
            </Paper>
          ) : requests.length === 0 ? (
            <Paper sx={{ p: 3 }}>No matching support requests.</Paper>
          ) : (
            requests.map((request) => (
              <Paper
                key={request.id}
                variant="outlined"
                sx={{
                  p: 2,
                  cursor: "pointer",
                  borderColor:
                    selected?.id === request.id ? "primary.main" : "divider",
                }}
                role="button"
                tabIndex={0}
                onClick={() => void openRequest(request.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    void openRequest(request.id);
                  }
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {request.subject}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {request.reference} · {request.name} · {request.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(request.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Chip
                      size="small"
                      label={request.source.replaceAll("_", " ")}
                    />
                    <Chip size="small" label={request.priority} />
                    <Chip
                      size="small"
                      color={request.status === "OPEN" ? "warning" : "default"}
                      label={request.status.replaceAll("_", " ")}
                    />
                  </Stack>
                </Stack>
              </Paper>
            ))
          )}
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            width: { xs: "100%", lg: 460 },
            alignSelf: "flex-start",
          }}
        >
          {!selected ? (
            <Typography color="text.secondary">
              Select a support request to view its protected details.
            </Typography>
          ) : (
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h6">{selected.subject}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selected.reference}
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="overline">Customer</Typography>
                <Typography>{selected.name}</Typography>
                <Typography>{selected.email}</Typography>
                {selected.phone ? (
                  <Typography>{selected.phone}</Typography>
                ) : null}
              </Box>
              <Box>
                <Typography variant="overline">Message</Typography>
                <Typography sx={{ whiteSpace: "pre-wrap" }}>
                  {selected.message}
                </Typography>
              </Box>
              {Object.keys(selected.context).length ? (
                <Box>
                  <Typography variant="overline">Context</Typography>
                  <Typography
                    component="pre"
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                  >
                    {JSON.stringify(selected.context, null, 2)}
                  </Typography>
                </Box>
              ) : null}
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={draftStatus}
                  onChange={(event) => setDraftStatus(event.target.value)}
                >
                  {STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  label="Priority"
                  value={draftPriority}
                  onChange={(event) => setDraftPriority(event.target.value)}
                >
                  {PRIORITIES.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Assignee</InputLabel>
                <Select
                  label="Assignee"
                  value={draftAssignee}
                  onChange={(event) => setDraftAssignee(event.target.value)}
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {assignees.map((assignee) => (
                    <MenuItem key={assignee.id} value={assignee.id}>
                      {assignee.name} ({assignee.role})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Internal note"
                value={draftNote}
                onChange={(event) => setDraftNote(event.target.value)}
                inputProps={{ maxLength: 2000 }}
                helperText="Staff-only. Note content is not copied to audit or outbox metadata."
              />
              <Button
                variant="contained"
                onClick={() => void save()}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </Stack>
          )}
        </Paper>
      </Stack>
    </Stack>
  );
}

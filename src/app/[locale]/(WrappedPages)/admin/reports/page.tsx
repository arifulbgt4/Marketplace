"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
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
} from "@mui/material";

const types = ["orders", "payments", "cod", "inventory"];

export default function AdminReportsPage() {
  const [type, setType] = useState("orders");
  const [currency, setCurrency] = useState("USD");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState("");

  const query = () => {
    const params = new URLSearchParams({
      type,
      currency,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return params;
  };

  useEffect(() => {
    setError("");
    fetch(`/api/admin/reports?${query()}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Unable to load report");
        setRows(data.rows ?? []);
      })
      .catch((loadError) =>
        setError(
          loadError instanceof Error ? loadError.message : "Unable to load report",
        ),
      );
    // query inputs intentionally trigger the report.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, currency, from, to]);

  const headers = rows.length ? Object.keys(rows[0]) : [];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Reports and exports</Typography>
        <Typography color="text.secondary">
          Currency and timezone are explicit in every generated report.
        </Typography>
      </Box>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Report</InputLabel>
          <Select
            value={type}
            label="Report"
            onChange={(event) => setType(event.target.value)}
          >
            {types.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          label="Currency"
          value={currency}
          onChange={(event) => setCurrency(event.target.value.toUpperCase())}
          inputProps={{ maxLength: 3 }}
        />
        <TextField
          size="small"
          label="From"
          type="date"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          size="small"
          label="To"
          type="date"
          value={to}
          onChange={(event) => setTo(event.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          component="a"
          href={`/api/admin/reports?${query()}&format=csv`}
          variant="outlined"
        >
          Download CSV
        </Button>
      </Stack>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <TableContainer component={Paper}>
        <Table size="small" aria-label={`${type} report`}>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={Math.max(headers.length, 1)}>
                  No report rows for this range.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell key={header}>{String(row[header] ?? "")}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
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
import { useCallback, useEffect, useState } from "react";

import {
  AdminEmpty,
  AdminError,
  AdminLoading,
  AdminPageHeader,
  adminRequest,
} from "src/components/Admin";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: "active" | "suspended" | "pending_verification";
  orderCount?: number;
  totalSpent?: number | string;
  currency?: string;
  createdAt: string;
};

type CustomersResponse = {
  customers: Customer[];
  total?: number;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const query = new URLSearchParams({ limit: "50" });
    if (search.trim()) query.set("search", search.trim());
    if (status) query.set("status", status);
    try {
      const response = await adminRequest<CustomersResponse | Customer[]>(
        `/api/admin/customers?${query}`,
      );
      setCustomers(Array.isArray(response) ? response : response.customers);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load customers",
      );
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 250);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function setCustomerStatus(customer: Customer) {
    const nextStatus = customer.status === "suspended" ? "active" : "suspended";
    setSavingId(customer.id);
    setError("");
    setSuccess("");
    try {
      await adminRequest(`/api/admin/customers/${customer.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: nextStatus,
          reason: "Account access changed from customer administration",
        }),
      });
      setSuccess(`${customer.name} is now ${nextStatus}.`);
      await load();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update customer",
      );
    } finally {
      setSavingId("");
    }
  }

  return (
    <Box>
      <AdminPageHeader
        title="Customers"
        description="Search customer accounts, review commerce activity, and manage access."
      />
      <Stack direction={{ xs: "column", md: "row" }} gap={2} mb={3}>
        <TextField
          label="Search name or email"
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ minWidth: { md: 300 } }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Account status</InputLabel>
          <Select
            value={status}
            label="Account status"
            onChange={(event) => setStatus(event.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="pending_verification">
              Pending verification
            </MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
          </Select>
        </FormControl>
      </Stack>
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
      {loading ? <AdminLoading label="Loading customers…" /> : null}
      {!loading && !error && customers.length === 0 ? (
        <AdminEmpty
          title="No customers found"
          description="Try a different search or status filter."
        />
      ) : null}
      {!loading && customers.length > 0 ? (
        <TableContainer component={Paper} variant="outlined">
          <Table aria-label="Marketplace customers">
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Orders</TableCell>
                <TableCell align="right">Total spent</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{customer.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {customer.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{customer.phone || "—"}</TableCell>
                  <TableCell>
                    <Chip size="small" label={customer.status} />
                  </TableCell>
                  <TableCell align="right">
                    {customer.orderCount ?? "—"}
                  </TableCell>
                  <TableCell align="right">
                    {customer.totalSpent !== undefined && customer.currency
                      ? new Intl.NumberFormat(undefined, {
                          style: "currency",
                          currency: customer.currency,
                        }).format(Number(customer.totalSpent))
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      color={
                        customer.status === "suspended" ? "primary" : "warning"
                      }
                      disabled={savingId === customer.id}
                      onClick={() => void setCustomerStatus(customer)}
                    >
                      {customer.status === "suspended"
                        ? "Reactivate"
                        : "Suspend"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </Box>
  );
}

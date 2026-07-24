"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
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

type OrderSummary = {
  id: string;
  orderNo: string;
  orderStatus: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  totalPrice: string;
  currency: string;
  placedAt: string | null;
  itemCount: number;
  customer: { name: string; email: string };
};

const orderStatuses = ["pending", "confirmed", "cancelled", "completed"];
const paymentStatuses = [
  "UNPAID",
  "PENDING",
  "PENDING_COLLECTION",
  "PAID",
  "COLLECTED",
  "FAILED",
  "CANCELLED",
  "PARTIALLY_REFUNDED",
  "REFUNDED",
];

function money(value: string, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(Number(value));
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const query = new URLSearchParams({ limit: "50" });
    if (search.trim()) query.set("search", search.trim());
    if (orderStatus) query.set("orderStatus", orderStatus);
    if (paymentStatus) query.set("paymentStatus", paymentStatus);
    try {
      const response = await fetch(`/api/admin/orders?${query}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Unable to load orders");
      setOrders(data.orders ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load orders",
      );
    } finally {
      setLoading(false);
    }
  }, [orderStatus, paymentStatus, search]);

  useEffect(() => {
    const timer = window.setTimeout(load, 250);
    return () => window.clearTimeout(timer);
  }, [load]);

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4">Orders</Typography>
          <Typography color="text.secondary">
            Search orders and manage payment and fulfillment state.
          </Typography>
        </Box>
        <Button variant="outlined" onClick={load}>
          Refresh
        </Button>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={3}>
        <TextField
          label="Order or customer"
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ minWidth: 260 }}
        />
        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel>Order status</InputLabel>
          <Select
            value={orderStatus}
            label="Order status"
            onChange={(event) => setOrderStatus(event.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {orderStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 210 }}>
          <InputLabel>Payment status</InputLabel>
          <Select
            value={paymentStatus}
            label="Payment status"
            onChange={(event) => setPaymentStatus(event.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {paymentStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}
      <TableContainer component={Paper}>
        <Table aria-label="Marketplace orders">
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Order status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Fulfillment</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Placed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>Loading orders…</TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>No matching orders.</TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Link href={`/admin/orders/${order.id}`}>
                      {order.orderNo}
                    </Link>
                    <Typography variant="caption" display="block">
                      {order.itemCount} item(s)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {order.customer.name}
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                    >
                      {order.customer.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={order.orderStatus} />
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={order.paymentStatus} />
                  </TableCell>
                  <TableCell>{order.fulfillmentStatus}</TableCell>
                  <TableCell align="right">
                    {money(order.totalPrice, order.currency)}
                  </TableCell>
                  <TableCell>
                    {order.placedAt
                      ? new Date(order.placedAt).toLocaleString()
                      : "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

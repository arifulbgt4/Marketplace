"use client";

import {
  AttachMoneyOutlined,
  GroupsOutlined,
  InventoryOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import {
  AdminError,
  AdminLoading,
  AdminPageHeader,
  adminRequest,
} from "src/components/Admin";

type DashboardData = {
  range: { currency: string };
  orders: { total: number };
  revenue: { netCollected: string; currency: string };
  customers: { total: number };
  inventory: { lowStockVariants: number };
};

type DashboardMetricKey = "orders" | "revenue" | "customers" | "lowStock";

function metricValue(key: DashboardMetricKey, data: DashboardData) {
  if (key === "orders")
    return new Intl.NumberFormat().format(data.orders.total);
  if (key === "customers") {
    return new Intl.NumberFormat().format(data.customers.total);
  }
  if (key === "lowStock") {
    return new Intl.NumberFormat().format(data.inventory.lowStockVariants);
  }
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: data.revenue.currency,
  }).format(Number(data.revenue.netCollected));
}

const metricDefinitions: Array<{
  key: DashboardMetricKey;
  label: string;
  icon:
    | typeof ReceiptLongOutlined
    | typeof AttachMoneyOutlined
    | typeof GroupsOutlined
    | typeof InventoryOutlined;
}> = [
  { key: "orders", label: "Orders", icon: ReceiptLongOutlined },
  { key: "revenue", label: "Net collected revenue", icon: AttachMoneyOutlined },
  { key: "customers", label: "Customers", icon: GroupsOutlined },
  { key: "lowStock", label: "Low-stock variants", icon: InventoryOutlined },
];

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await adminRequest<DashboardData>("/api/admin/dashboard"));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load dashboard",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Box>
      <AdminPageHeader
        title="Dashboard"
        description="Current marketplace operations and recent order activity."
      />
      {loading ? <AdminLoading label="Loading dashboard…" /> : null}
      {!loading && error ? <AdminError message={error} retry={load} /> : null}
      {!loading && !error && data ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {metricDefinitions.map(({ key, label, icon: Icon }) => (
            <Paper key={key} variant="outlined" sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    {label}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} mt={1}>
                    {metricValue(key, data)}
                  </Typography>
                </Box>
                <Icon color="primary" />
              </Stack>
            </Paper>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

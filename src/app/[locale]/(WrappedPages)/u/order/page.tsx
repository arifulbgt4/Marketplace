"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { formatDateTime, formatMoney } from "src/lib/i18n";

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
  itemPreview: {
    id: string;
    productName: string;
    sku: string;
    quantity: number;
  }[];
};

export default function CustomerOrdersPage() {
  const locale = useLocale();
  const t = useTranslations("Orders");
  const common = useTranslations("Common");
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/orders?limit=50")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message ?? t("loadError"));
        if (active) setOrders(data.orders ?? []);
      })
      .catch((loadError) => {
        if (active) {
          setError(
            loadError instanceof Error ? loadError.message : t("loadError"),
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [t]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3">{t("title")}</Typography>
        <Typography color="text.secondary">{t("description")}</Typography>
      </Box>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {loading ? (
        <Stack spacing={2}>
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} variant="rounded" height={150} />
          ))}
        </Stack>
      ) : orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6">{t("emptyTitle")}</Typography>
          <Typography color="text.secondary" mb={2}>
            {t("emptyDescription")}
          </Typography>
          <Button LinkComponent={Link} href="/products" variant="contained">
            {common("browseProducts")}
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {orders.map((order) => (
            <Paper key={order.id} sx={{ p: 3 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                gap={2}
              >
                <Box>
                  <Typography variant="h6">{order.orderNo}</Typography>
                  <Typography color="text.secondary">
                    {order.itemPreview
                      .map((item) => `${item.productName} × ${item.quantity}`)
                      .join(", ")}
                    {order.itemCount > order.itemPreview.length
                      ? ` ${t("moreItems", {
                          count: order.itemCount - order.itemPreview.length,
                        })}`
                      : ""}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {order.placedAt
                      ? formatDateTime(order.placedAt, locale)
                      : ""}
                  </Typography>
                </Box>
                <Stack
                  alignItems={{ xs: "flex-start", md: "flex-end" }}
                  gap={1}
                >
                  <Typography variant="h6">
                    {formatMoney(order.totalPrice, order.currency, locale)}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip size="small" label={order.orderStatus} />
                    <Chip size="small" label={order.paymentStatus} />
                    <Chip size="small" label={order.fulfillmentStatus} />
                  </Stack>
                  <Button
                    LinkComponent={Link}
                    href={`/u/order/${order.id}`}
                    size="small"
                  >
                    {t("viewDetails")}
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

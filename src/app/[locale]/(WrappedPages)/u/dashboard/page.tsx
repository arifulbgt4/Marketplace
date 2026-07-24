"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Avatar,
  Button,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

type Profile = {
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
};

type Order = {
  id: string;
  orderStatus: string;
  fulfillmentStatus: string;
};

export default function CustomerDashboardPage() {
  const t = useTranslations("Account");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/profile"),
      fetch("/api/orders?limit=100"),
      fetch("/api/wishlist"),
    ])
      .then(async (responses) => {
        const payloads = await Promise.all(
          responses.map((response) => response.json()),
        );
        const failedIndex = responses.findIndex((response) => !response.ok);
        if (failedIndex >= 0) {
          throw new Error(payloads[failedIndex].message ?? t("loadError"));
        }
        setProfile(payloads[0]);
        setOrders(payloads[1].orders ?? []);
        setWishlistCount(payloads[2].items?.length ?? 0);
      })
      .catch((loadError) =>
        setError(
          loadError instanceof Error ? loadError.message : t("loadError"),
        ),
      )
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) {
    return <Skeleton variant="rounded" height={320} />;
  }

  const metrics = [
    { label: t("totalOrders"), value: orders.length, href: "/u/order" },
    {
      label: t("activeOrders"),
      value: orders.filter((order) =>
        ["pending", "confirmed"].includes(order.orderStatus),
      ).length,
      href: "/u/order",
    },
    {
      label: t("delivered"),
      value: orders.filter((order) => order.fulfillmentStatus === "DELIVERED")
        .length,
      href: "/u/order",
    },
    { label: t("wishlist"), value: wishlistCount, href: "/u/bookmark" },
  ];

  return (
    <Stack spacing={4}>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Paper sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Avatar
            src={profile?.image ?? undefined}
            sx={{ width: 64, height: 64 }}
          >
            {profile?.name?.slice(0, 1)}
          </Avatar>
          <div>
            <Typography variant="h4">
              {profile
                ? t("welcome", { name: profile.name })
                : t("welcomeGuest")}
            </Typography>
            <Typography color="text.secondary">
              {profile?.email}
              {profile?.phone ? ` · ${profile.phone}` : ""}
            </Typography>
          </div>
          <Button
            component={Link}
            href="/u/setting"
            variant="outlined"
            sx={{ ml: { sm: "auto" } }}
          >
            {t("editProfile")}
          </Button>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} lg={3} key={metric.label}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography color="text.secondary">{metric.label}</Typography>
              <Typography variant="h3" my={1}>
                {metric.value}
              </Typography>
              <Button component={Link} href={metric.href} size="small">
                {t("view")}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

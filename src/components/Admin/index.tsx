"use client";

import {
  AccountBalanceWalletOutlined,
  ArticleOutlined,
  AssessmentOutlined,
  CategoryOutlined,
  DashboardOutlined,
  GroupsOutlined,
  Inventory2Outlined,
  HistoryOutlined,
  LocalOfferOutlined,
  LocalShippingOutlined,
  Menu as MenuIcon,
  PaletteOutlined,
  PaymentsOutlined,
  ReceiptLongOutlined,
  RateReviewOutlined,
  SettingsOutlined,
  StorefrontOutlined,
  SupportAgentOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

const DRAWER_WIDTH = 264;

const navigation = [
  { href: "/admin", label: "Dashboard", icon: DashboardOutlined },
  { href: "/admin/orders", label: "Orders", icon: ReceiptLongOutlined },
  { href: "/admin/customers", label: "Customers", icon: GroupsOutlined },
  { href: "/admin/products", label: "Products", icon: StorefrontOutlined },
  { href: "/admin/categories", label: "Categories", icon: CategoryOutlined },
  { href: "/admin/inventory", label: "Inventory", icon: Inventory2Outlined },
  { href: "/admin/delivery", label: "Delivery", icon: LocalShippingOutlined },
  { href: "/admin/cod", label: "Cash on Delivery", icon: PaymentsOutlined },
  { href: "/admin/coupons", label: "Coupons", icon: LocalOfferOutlined },
  { href: "/admin/content", label: "Homepage content", icon: ArticleOutlined },
  { href: "/admin/reviews", label: "Reviews", icon: RateReviewOutlined },
  { href: "/admin/support", label: "Support", icon: SupportAgentOutlined },
  { href: "/admin/reports", label: "Reports", icon: AssessmentOutlined },
  { href: "/admin/audit", label: "Audit log", icon: HistoryOutlined },
  {
    href: "/admin/settings/business",
    label: "Business settings",
    icon: SettingsOutlined,
  },
  {
    href: "/admin/settings/branding",
    label: "Branding",
    icon: PaletteOutlined,
  },
  {
    href: "/admin/settings/payments",
    label: "Payment methods",
    icon: AccountBalanceWalletOutlined,
  },
] as const;

function NavContent({ close }: { close?: () => void }) {
  const pathname = usePathname();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Typography variant="overline" color="text.secondary">
          Marketplace
        </Typography>
        <Typography variant="h6">Admin console</Typography>
      </Box>
      <Divider />
      <List component="nav" aria-label="Admin navigation" sx={{ p: 1.5 }}>
        {navigation.map((item) => {
          const selected =
            item.href === "/admin"
              ? pathname.endsWith("/admin")
              : pathname.includes(item.href);
          const Icon = item.icon;
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={selected}
              onClick={close}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "calc(100vh - 80px)" }}>
      <Box
        component="aside"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: 0 }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH },
          }}
        >
          <NavContent close={() => setMobileOpen(false)} />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              position: "relative",
              height: "100%",
              borderTop: 0,
            },
          }}
        >
          <NavContent />
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Paper
          square
          elevation={0}
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <IconButton
            aria-label="Open admin navigation"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={700}>
            Admin console
          </Typography>
        </Paper>
        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "center" }}
      gap={2}
      mb={3}
    >
      <Box>
        <Typography component="h1" variant="h4" fontWeight={700}>
          {title}
        </Typography>
        <Typography color="text.secondary" mt={0.5}>
          {description}
        </Typography>
      </Box>
      {action}
    </Stack>
  );
}

export function AdminLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <Stack
      role="status"
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ minHeight: 220 }}
    >
      <CircularProgress size={32} />
      <Typography color="text.secondary">{label}</Typography>
    </Stack>
  );
}

export function AdminError({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <Alert
      severity="error"
      action={
        retry ? (
          <Button color="inherit" size="small" onClick={retry}>
            Retry
          </Button>
        ) : undefined
      }
    >
      {message}
    </Alert>
  );
}

export function AdminEmpty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary" mt={1}>
        {description}
      </Typography>
    </Paper>
  );
}

export async function adminRequest<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const data = (await response.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!response.ok) {
    throw new Error(
      (typeof data?.message === "string" && data.message) ||
        (typeof data?.error === "string" && data.error) ||
        `Request failed with status ${response.status}`,
    );
  }
  return data as T;
}

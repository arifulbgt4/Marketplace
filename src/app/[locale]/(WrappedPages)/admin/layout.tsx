import { Box, Container, Typography, Stack, Paper } from "@mui/material";
import Link from "next/link";

const navItems = [
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/delivery", label: "Delivery Zones" },
  { href: "/admin/coupons", label: "Coupons" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack direction="row" spacing={4}>
        <Paper sx={{ width: 200, p: 2, height: "fit-content" }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Catalog Admin
          </Typography>
          <Stack spacing={1}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  padding: "8px 12px",
                  borderRadius: 8,
                  display: "block",
                }}
              >
                <Typography variant="body2">{item.label}</Typography>
              </Link>
            ))}
          </Stack>
        </Paper>
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
      </Stack>
    </Container>
  );
}

"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
  Stack, TextField, Select, MenuItem, FormControl, InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PublishIcon from "@mui/icons-material/Publish";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  status: string;
  category: { id: string; name: string } | null;
  createdBy: { id: string; name: string };
  variants: { id: string; sku: string; price: unknown; inventory: { onHand: number; reserved: number } | null }[];
  media: { url: string }[];
  createdAt: string;
}

const statusColors: Record<string, "default" | "primary" | "success" | "warning"> = {
  draft: "default",
  published: "success",
  archived: "warning",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      params.set("limit", "50");
      const res = await fetch(`/api/admin/products?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handlePublish = async (id: string) => {
    const res = await fetch(`/api/admin/products/${id}/publish`, { method: "POST" });
    if (res.ok) fetchProducts();
    else {
      const err = await res.json();
      alert(err.message || "Cannot publish");
    }
  };

  const handleArchive = async (id: string) => {
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) fetchProducts();
    else {
      const err = await res.json();
      alert(err.message || "Cannot archive");
    }
  };

  const totalStock = (p: Product) =>
    p.variants.reduce((sum, v) => sum + (v.inventory?.onHand || 0), 0);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" startIcon={<AddIcon />} LinkComponent={Link} href="/admin/products/new">
          New Product
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField size="small" label="Search" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 250 }} />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Variants</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>
            ) : products.length === 0 ? (
              <TableRow><TableCell colSpan={7}>No products found</TableCell></TableRow>
            ) : products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Link href={`/admin/products/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <Typography fontWeight={500}>{p.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{p.slug}</Typography>
                  </Link>
                </TableCell>
                <TableCell>
                  <Chip label={p.status} color={statusColors[p.status] || "default"} size="small" />
                </TableCell>
                <TableCell>{p.category?.name || "-"}</TableCell>
                <TableCell>{p.variants.length}</TableCell>
                <TableCell>{totalStock(p)}</TableCell>
                <TableCell>{p.createdBy?.name || "-"}</TableCell>
                <TableCell>
                  <IconButton size="small" LinkComponent={Link} href={`/admin/products/${p.id}`}>
                    <EditIcon />
                  </IconButton>
                  {p.status === "draft" && (
                    <IconButton size="small" onClick={() => handlePublish(p.id)}>
                      <PublishIcon />
                    </IconButton>
                  )}
                  {p.status !== "archived" && (
                    <IconButton size="small" onClick={() => handleArchive(p.id)}>
                      <Box component="span" sx={{ fontSize: 16 }}>🗄️</Box>
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

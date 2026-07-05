"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Switch, IconButton, Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  parentId: string | null;
  parent: { id: string; name: string } | null;
  displayOrder: number;
  isActive: boolean;
  _count: { products: number; listings: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", icon: "", parentId: "", displayOrder: 0 });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) setCategories(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: "", slug: "", icon: "", parentId: "", displayOrder: 0 });
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditItem(cat);
    setForm({
      name: cat.name, slug: cat.slug, icon: cat.icon || "",
      parentId: cat.parentId || "", displayOrder: cat.displayOrder,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const body: Record<string, unknown> = {
      name: form.name,
      slug: form.slug,
      icon: form.icon || null,
      displayOrder: form.displayOrder,
      parentId: form.parentId || null,
    };

    const url = editItem ? `/api/admin/categories/${editItem.id}` : "/api/admin/categories";
    const method = editItem ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

    if (res.ok) {
      setDialogOpen(false);
      fetchCategories();
    } else {
      const err = await res.json();
      alert(err.message || "Failed to save");
    }
  };

  const handleArchive = async (id: string) => {
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) fetchCategories();
    else {
      const err = await res.json();
      alert(err.message || "Failed to archive");
    }
  };

  if (loading) return <Typography>Loading categories...</Typography>;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Categories</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          New Category
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Parent</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id} sx={{ opacity: cat.isActive ? 1 : 0.5 }}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.slug}</TableCell>
                <TableCell>{cat.parent?.name || "-"}</TableCell>
                <TableCell>{cat.displayOrder}</TableCell>
                <TableCell>{cat.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>{cat._count.products + cat._count.listings}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEdit(cat)} size="small"><EditIcon /></IconButton>
                  <IconButton onClick={() => handleArchive(cat.id)} size="small"><ArchiveIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? "Edit Category" : "New Category"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
            <TextField label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} fullWidth />
            <TextField label="Icon (MUI icon name)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} fullWidth />
            <TextField label="Display Order" type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} fullWidth />
            <TextField label="Parent Category ID" value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })} fullWidth helperText="Leave empty for top-level category" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

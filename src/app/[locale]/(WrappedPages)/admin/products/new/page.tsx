"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Typography, TextField, Button, Stack, Paper,
  Grid, IconButton, Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface VariantForm {
  sku: string;
  price: string;
  compareAtPrice: string;
}

interface MediaForm {
  url: string;
  alt: string;
}

interface OptionForm {
  name: string;
  values: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [variants, setVariants] = useState<VariantForm[]>([{ sku: "", price: "", compareAtPrice: "" }]);
  const [mediaList, setMediaList] = useState<MediaForm[]>([{ url: "", alt: "" }]);
  const [options, setOptions] = useState<OptionForm[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const addVariant = () => setVariants([...variants, { sku: "", price: "", compareAtPrice: "" }]);
  const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, field: keyof VariantForm, value: string) => {
    const updated = [...variants];
    updated[i] = { ...updated[i], [field]: value };
    setVariants(updated);
  };

  const addMedia = () => setMediaList([...mediaList, { url: "", alt: "" }]);
  const removeMedia = (i: number) => setMediaList(mediaList.filter((_, idx) => idx !== i));
  const updateMedia = (i: number, field: keyof MediaForm, value: string) => {
    const updated = [...mediaList];
    updated[i] = { ...updated[i], [field]: value };
    setMediaList(updated);
  };

  const addOption = () => setOptions([...options, { name: "", values: "" }]);
  const removeOption = (i: number) => setOptions(options.filter((_, idx) => idx !== i));
  const updateOption = (i: number, field: keyof OptionForm, value: string) => {
    const updated = [...options];
    updated[i] = { ...updated[i], [field]: value };
    setOptions(updated);
  };

  const handleSubmit = async () => {
    setError("");
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        description,
        brand: brand || null,
        taxClass: null,
        categoryId: categoryId || null,
        variants: variants.filter((v) => v.sku && v.price).map((v) => ({
          sku: v.sku,
          price: Number(v.price),
          compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
        })),
        media: mediaList.filter((m) => m.url).map((m, idx) => ({
          url: m.url,
          alt: m.alt || null,
          order: idx,
        })),
        options: options.filter((o) => o.name && o.values).map((o) => ({
          name: o.name,
          values: o.values.split(",").map((v) => v.trim()),
        })),
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const product = await res.json();
        router.push(`/admin/products/${product.id}`);
      } else {
        const err = await res.json();
        setError(err.message || "Failed to create product");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box maxWidth={800}>
      <Typography variant="h4" mb={3}>New Product</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>Basic Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Product Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} fullWidth helperText="Leave empty to auto-generate" />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={4} required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Category ID" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} fullWidth helperText="UUID of existing category" />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Variants / SKUs</Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={addVariant}>Add Variant</Button>
        </Stack>
        {variants.map((v, i) => (
          <Stack key={i} direction="row" spacing={2} mb={1} alignItems="center">
            <TextField size="small" label="SKU" value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} required sx={{ flex: 1 }} />
            <TextField size="small" label="Price" type="number" value={v.price} onChange={(e) => updateVariant(i, "price", e.target.value)} required sx={{ flex: 1 }} />
            <TextField size="small" label="Compare At" type="number" value={v.compareAtPrice} onChange={(e) => updateVariant(i, "compareAtPrice", e.target.value)} sx={{ flex: 1 }} />
            {variants.length > 1 && <IconButton onClick={() => removeVariant(i)} size="small"><DeleteIcon /></IconButton>}
          </Stack>
        ))}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Media</Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={addMedia}>Add Image</Button>
        </Stack>
        {mediaList.map((m, i) => (
          <Stack key={i} direction="row" spacing={2} mb={1} alignItems="center">
            <TextField size="small" label="Image URL" value={m.url} onChange={(e) => updateMedia(i, "url", e.target.value)} sx={{ flex: 2 }} />
            <TextField size="small" label="Alt Text" value={m.alt} onChange={(e) => updateMedia(i, "alt", e.target.value)} sx={{ flex: 1 }} />
            {mediaList.length > 1 && <IconButton onClick={() => removeMedia(i)} size="small"><DeleteIcon /></IconButton>}
          </Stack>
        ))}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Options (size, color, etc.)</Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={addOption}>Add Option</Button>
        </Stack>
        {options.map((o, i) => (
          <Stack key={i} direction="row" spacing={2} mb={1} alignItems="center">
            <TextField size="small" label="Option Name" value={o.name} onChange={(e) => updateOption(i, "name", e.target.value)} sx={{ flex: 1 }} />
            <TextField size="small" label="Values (comma-separated)" value={o.values} onChange={(e) => updateOption(i, "values", e.target.value)} sx={{ flex: 2 }} />
            <IconButton onClick={() => removeOption(i)} size="small"><DeleteIcon /></IconButton>
          </Stack>
        ))}
      </Paper>

      <Button variant="contained" size="large" onClick={handleSubmit} disabled={saving}>
        {saving ? "Creating..." : "Create Product"}
      </Button>
    </Box>
  );
}

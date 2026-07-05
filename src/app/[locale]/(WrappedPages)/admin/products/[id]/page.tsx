"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Typography, TextField, Button, Stack, Paper,
  Grid, IconButton, Alert, Chip, Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PublishIcon from "@mui/icons-material/Publish";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string | null;
  taxClass: string | null;
  status: string;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  variants: {
    id: string; sku: string; price: string;
    compareAtPrice: string | null;
    inventory: { id: string; onHand: number; reserved: number } | null;
  }[];
  media: { id: string; url: string; alt: string | null; order: number }[];
  options: { id: string; name: string; values: string[] }[];
}

export default function EditProductPage({ params }: PageProps) {
  const resolved = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newMediaAlt, setNewMediaAlt] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${resolved.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setName(data.name);
          setSlug(data.slug);
          setDescription(data.description);
          setBrand(data.brand || "");
          setCategoryId(data.categoryId || "");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [resolved.id]);

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${resolved.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description, brand: brand || null, categoryId: categoryId || null }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProduct(updated);
      } else {
        const err = await res.json();
        setError(err.message || "Failed to update");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const res = await fetch(`/api/admin/products/${resolved.id}/publish`, { method: "POST" });
    if (res.ok) {
      const updated = await res.json();
      setProduct(updated);
    } else {
      const err = await res.json();
      alert(err.message || "Cannot publish");
    }
  };

  const handleAddMedia = async () => {
    if (!newMediaUrl) return;
    const res = await fetch(`/api/admin/products/${resolved.id}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: newMediaUrl,
        alt: newMediaAlt || null,
        order: product?.media.length || 0,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProduct((prev) =>
        prev ? { ...prev, media: [...prev.media, updated] } : prev
      );
      setNewMediaUrl("");
      setNewMediaAlt("");
    } else {
      const err = await res.json();
      alert(err.message || "Failed to add media");
    }
  };

  const handleAddVariant = async () => {
    if (!newSku || !newPrice) return;
    const res = await fetch(`/api/admin/products/${resolved.id}/variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku: newSku, price: Number(newPrice) }),
    });
    if (res.ok) {
      const updated = await res.json();
      window.location.reload();
    } else {
      const err = await res.json();
      alert(err.message || "Failed to add variant");
    }
  };

  if (loading) return <Typography>Loading product...</Typography>;
  if (!product) return <Typography color="error">Product not found</Typography>;

  return (
    <Box maxWidth={800}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Edit: {product.name}</Typography>
        <Stack direction="row" spacing={1}>
          <Chip label={product.status} color={product.status === "published" ? "success" : product.status === "archived" ? "warning" : "default"} />
          {product.status === "draft" && (
            <Button variant="contained" startIcon={<PublishIcon />} onClick={handlePublish}>
              Publish
            </Button>
          )}
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>Basic Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={4} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Category ID" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} fullWidth />
          </Grid>
        </Grid>
        <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ mt: 2 }}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>Media</Typography>
        {product.media.length === 0 && <Typography color="text.secondary" mb={1}>No media</Typography>}
        <Grid container spacing={1} mb={2}>
          {product.media.map((m) => (
            <Grid item key={m.id}>
              <Box
                component="img"
                src={m.url}
                alt={m.alt || ""}
                sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 1 }}
              />
            </Grid>
          ))}
        </Grid>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField size="small" label="Image URL" value={newMediaUrl} onChange={(e) => setNewMediaUrl(e.target.value)} sx={{ flex: 2 }} />
          <TextField size="small" label="Alt Text" value={newMediaAlt} onChange={(e) => setNewMediaAlt(e.target.value)} sx={{ flex: 1 }} />
          <Button variant="outlined" onClick={handleAddMedia}>Add</Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>Variants</Typography>
        {product.variants.map((v) => (
          <Stack key={v.id} direction="row" spacing={2} mb={1} alignItems="center">
            <Typography sx={{ flex: 1, fontWeight: 500 }}>{v.sku}</Typography>
            <Typography sx={{ flex: 1 }}>${Number(v.price).toFixed(2)}</Typography>
            <Typography sx={{ flex: 1 }}>Stock: {v.inventory?.onHand ?? 0} (Reserved: {v.inventory?.reserved ?? 0})</Typography>
          </Stack>
        ))}
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField size="small" label="SKU" value={newSku} onChange={(e) => setNewSku(e.target.value)} />
          <TextField size="small" label="Price" type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
          <Button variant="outlined" onClick={handleAddVariant}>Add Variant</Button>
        </Stack>
      </Paper>

      {product.options.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" mb={2}>Options</Typography>
          {product.options.map((o) => (
            <Typography key={o.id}>
              <strong>{o.name}:</strong> {o.values.join(", ")}
            </Typography>
          ))}
        </Paper>
      )}
    </Box>
  );
}

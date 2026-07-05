"use client";
import { useState, useEffect, use } from "react";
import {
  Box, Container, Grid, Typography, CardMedia, Chip, Stack,
  Table, TableBody, TableCell, TableContainer, TableRow,
  Paper, Skeleton, Breadcrumbs, Link as MuiLink,
} from "@mui/material";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string | null;
  status: string;
  category: { id: string; name: string; slug: string } | null;
  variants: {
    id: string; sku: string; price: string;
    compareAtPrice: string | null;
    inventory: { onHand: number } | null;
  }[];
  media: { id: string; url: string; alt: string | null; order: number }[];
  options: { id: string; name: string; values: string[] }[];
  createdBy: { id: string; name: string } | null;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolved = use(params);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/catalog?slug=${resolved.slug}`);
        if (res.ok) setProduct(await res.json());
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [resolved.slug]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rounded" height={400} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="40%" />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" color="error">Product not found</Typography>
        <MuiLink component={Link} href="/products">Back to products</MuiLink>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink component={Link} href="/" underline="hover" color="inherit">Home</MuiLink>
        <MuiLink component={Link} href="/products" underline="hover" color="inherit">Products</MuiLink>
        {product.category && (
          <MuiLink component={Link} href={`/products?categoryId=${product.category.id}`} underline="hover" color="inherit">
            {product.category.name}
          </MuiLink>
        )}
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {product.media.length > 0 ? (
            <CardMedia
              component="img"
              image={product.media[0].url}
              alt={product.media[0].alt || product.name}
              sx={{ width: "100%", maxHeight: 500, objectFit: "cover", borderRadius: 2 }}
            />
          ) : (
            <Box
              sx={{
                width: "100%", height: 400, bgcolor: "grey.100",
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 2,
              }}
            >
              <Typography color="text.secondary">No image available</Typography>
            </Box>
          )}

          {product.media.length > 1 && (
            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
              {product.media.map((m) => (
                <Box
                  key={m.id}
                  component="img"
                  src={m.url}
                  alt={m.alt || ""}
                  sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1, cursor: "pointer" }}
                />
              ))}
            </Stack>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          {product.brand && (
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {product.brand}
            </Typography>
          )}
          <Typography variant="h3" gutterBottom>{product.name}</Typography>
          {product.category && (
            <Chip label={product.category.name} size="small" sx={{ mb: 2 }} />
          )}

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, whiteSpace: "pre-wrap" }}>
            {product.description}
          </Typography>

          <Typography variant="h5" fontWeight={600} gutterBottom>Variants</Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table size="small">
              <TableBody>
                {product.variants.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell><strong>{v.sku}</strong></TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>${Number(v.price).toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell>
                      {v.inventory && v.inventory.onHand > 0 ? (
                        <Chip label="In Stock" color="success" size="small" />
                      ) : (
                        <Chip label="Out of Stock" color="error" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {product.options.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>Options</Typography>
              {product.options.map((o) => (
                <Typography key={o.id} variant="body2" color="text.secondary">
                  <strong>{o.name}:</strong> {o.values.join(", ")}
                </Typography>
              ))}
            </Box>
          )}

          {product.createdBy && (
            <Typography variant="caption" color="text.secondary">
              Listed by {product.createdBy.name}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

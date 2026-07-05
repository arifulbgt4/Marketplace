"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Box, Container, Grid, Typography, Card, CardMedia, CardContent,
  CardActions, Button, TextField, Select, MenuItem, FormControl,
  InputLabel, Stack, Skeleton, Chip,
} from "@mui/material";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface Product {
  id: string;
  name: string;
  slug: string;
  status: string;
  category: { id: string; name: string; slug: string } | null;
  variants: { id: string; sku: string; price: string; inventory: { onHand: number } | null }[];
  media: { url: string; alt: string | null }[];
  createdAt: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get("query") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page")) || 1;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (categoryId) params.set("categoryId", categoryId);
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", "24");

      const res = await fetch(`/api/catalog?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      }
    } finally {
      setLoading(false);
    }
  }, [query, categoryId, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const minPrice = (variants: { price: string }[]) => {
    if (variants.length === 0) return 0;
    return Math.min(...variants.map((v) => Number(v.price)));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" mb={3}>Products</Typography>

      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" useFlexGap>
        <TextField
          size="small" label="Search"
          defaultValue={query}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") updateParams({ query: (e.target as HTMLInputElement).value });
          }}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort</InputLabel>
          <Select value={sort} label="Sort" onChange={(e) => updateParams({ sort: e.target.value })}>
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="name_asc">Name A-Z</MenuItem>
            <MenuItem value="name_desc">Name Z-A</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rounded" height={320} />
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Typography textAlign="center" py={8} color="text.secondary">
          No products found. Try a different search.
        </Typography>
      ) : (
        <>
          <Typography mb={2} color="text.secondary">{total} product(s) found</Typography>
          <Grid container spacing={3}>
            {products.map((p) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    component="img"
                    height={200}
                    image={p.media[0]?.url || "https://placehold.co/400x400?text=No+Image"}
                    alt={p.media[0]?.alt || p.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    {p.category && <Chip label={p.category.name} size="small" sx={{ mb: 1 }} />}
                    <Typography variant="h6" gutterBottom noWrap>
                      {p.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      From ${minPrice(p.variants).toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" LinkComponent={Link} href={`/products/${p.slug}`}>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Stack direction="row" spacing={1} justifyContent="center" mt={4}>
              {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? "contained" : "outlined"}
                  size="small"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", String(i + 1));
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                >
                  {i + 1}
                </Button>
              ))}
            </Stack>
          )}
        </>
      )}
    </Container>
  );
}

"use client";
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import WishlistButton from "src/components/WishlistButton";
import { useStorefrontSettings } from "src/contexts/StorefrontSettings";
import { formatMoney } from "src/lib/i18n";

import ProductSearchSuggestions from "./ProductSearchSuggestions";

interface Product {
  id: string;
  name: string;
  slug: string;
  status: string;
  category: { id: string; name: string; slug: string } | null;
  media: { url: string; alt: string | null }[];
  minPrice: string | null;
  availableQuantity: number;
  createdAt: string;
}

type Facets = {
  categories: { id: string; name: string; slug: string; count: number }[];
  price: { min: string | null; max: string | null };
  availability: { inStock: number; outOfStock: number };
};

const EMPTY_FACETS: Facets = {
  categories: [],
  price: { min: null, max: null },
  availability: { inStock: 0, outOfStock: 0 },
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const text = useTranslations("Catalog");
  const common = useTranslations("Common");
  const settings = useStorefrontSettings();
  const currency = settings?.business.defaultCurrency ?? "USD";

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [facets, setFacets] = useState<Facets>(EMPTY_FACETS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const query = searchParams.get("query") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const availability = searchParams.get("availability") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page")) || 1;
  const [minimumDraft, setMinimumDraft] = useState(minPrice);
  const [maximumDraft, setMaximumDraft] = useState(maxPrice);

  useEffect(() => {
    setMinimumDraft(minPrice);
    setMaximumDraft(maxPrice);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (categoryId) params.set("categoryId", categoryId);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (availability) params.set("availability", availability);
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", "24");

      try {
        const res = await fetch(`/api/catalog?${params}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as {
            message?: string;
          } | null;
          throw new Error(body?.message ?? text("loadError"));
        }
        const data = await res.json();
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
        setFacets(data.facets || EMPTY_FACETS);
      } catch (cause: unknown) {
        if (cause instanceof DOMException && cause.name === "AbortError")
          return;
        setProducts([]);
        setTotal(0);
        setTotalPages(0);
        setError(cause instanceof Error ? cause.message : text("loadError"));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void fetchProducts();
    return () => controller.abort();
  }, [
    query,
    categoryId,
    minPrice,
    maxPrice,
    availability,
    sort,
    page,
    retryKey,
    text,
  ]);

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    params.delete("page");
    const suffix = params.toString();
    router.push(suffix ? `${pathname}?${suffix}` : pathname);
  };

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));
    const suffix = params.toString();
    router.push(suffix ? `${pathname}?${suffix}` : pathname);
  };

  const applyPrice = () => {
    updateFilters({
      minPrice: minimumDraft,
      maxPrice: maximumDraft,
    });
  };

  const clearFilters = () => {
    setMinimumDraft("");
    setMaximumDraft("");
    router.push(pathname);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" mb={3}>
        {text("title")}
      </Typography>

      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" useFlexGap>
        <ProductSearchSuggestions
          query={query}
          onSearch={(value) => updateFilters({ query: value })}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="product-category-filter-label">
            {text("category")}
          </InputLabel>
          <Select
            id="product-category-filter"
            labelId="product-category-filter-label"
            value={categoryId}
            label={text("category")}
            onChange={(event) =>
              updateFilters({ categoryId: event.target.value })
            }
          >
            <MenuItem value="">{text("allCategories")}</MenuItem>
            {facets.categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name} ({category.count})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          label={text("minimumPrice")}
          type="number"
          value={minimumDraft}
          onChange={(event) => setMinimumDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") applyPrice();
          }}
          inputProps={{ min: 0, step: "0.01" }}
          sx={{ width: 140 }}
        />
        <TextField
          size="small"
          label={text("maximumPrice")}
          type="number"
          value={maximumDraft}
          onChange={(event) => setMaximumDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") applyPrice();
          }}
          inputProps={{ min: 0, step: "0.01" }}
          sx={{ width: 140 }}
        />
        <Button variant="outlined" onClick={applyPrice}>
          {text("applyPrice")}
        </Button>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="product-availability-filter-label">
            {text("availability")}
          </InputLabel>
          <Select
            id="product-availability-filter"
            labelId="product-availability-filter-label"
            value={availability}
            label={text("availability")}
            onChange={(event) =>
              updateFilters({ availability: event.target.value })
            }
          >
            <MenuItem value="">{text("anyAvailability")}</MenuItem>
            <MenuItem value="in_stock">
              {text("inStockWithCount", {
                count: facets.availability.inStock,
              })}
            </MenuItem>
            <MenuItem value="out_of_stock">
              {text("outOfStockWithCount", {
                count: facets.availability.outOfStock,
              })}
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="product-sort-label">{text("sort")}</InputLabel>
          <Select
            id="product-sort"
            labelId="product-sort-label"
            value={sort}
            label={text("sort")}
            onChange={(event) => updateFilters({ sort: event.target.value })}
          >
            <MenuItem value="newest">{text("newest")}</MenuItem>
            <MenuItem value="oldest">{text("oldest")}</MenuItem>
            <MenuItem value="name_asc">{text("nameAscending")}</MenuItem>
            <MenuItem value="name_desc">{text("nameDescending")}</MenuItem>
            <MenuItem value="price_asc">{text("priceAscending")}</MenuItem>
            <MenuItem value="price_desc">{text("priceDescending")}</MenuItem>
          </Select>
        </FormControl>
        <Button color="inherit" onClick={clearFilters}>
          {text("clearFilters")}
        </Button>
      </Stack>

      {(facets.price.min || facets.price.max) && (
        <Typography variant="body2" color="text.secondary" mb={2}>
          {text("catalogRange", {
            minimum: facets.price.min
              ? formatMoney(facets.price.min, currency, locale)
              : "—",
            maximum: facets.price.max
              ? formatMoney(facets.price.max, currency, locale)
              : "—",
          })}
        </Typography>
      )}

      {error ? (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setRetryKey((value) => value + 1)}
            >
              {common("retry")}
            </Button>
          }
        >
          {error}
        </Alert>
      ) : loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rounded" height={320} />
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Typography textAlign="center" py={8} color="text.secondary">
          {text("noProducts")}
        </Typography>
      ) : (
        <>
          <Typography mb={2} color="text.secondary" aria-live="polite">
            {text("resultCount", { count: total })}
          </Typography>
          <Grid container spacing={3}>
            {products.map((p) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    height={200}
                    image={
                      p.media[0]?.url ||
                      "https://placehold.co/400x400?text=No+Image"
                    }
                    alt={p.media[0]?.alt || p.name}
                    loading="lazy"
                    decoding="async"
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    {p.category && (
                      <Chip
                        label={p.category.name}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    )}
                    <Typography variant="h6" gutterBottom noWrap>
                      {p.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {p.minPrice
                        ? text("fromPrice", {
                            price: formatMoney(p.minPrice, currency, locale),
                          })
                        : text("priceUnavailable")}
                    </Typography>
                    <Chip
                      size="small"
                      color={p.availableQuantity > 0 ? "success" : "default"}
                      label={
                        p.availableQuantity > 0
                          ? text("availableCount", {
                              count: p.availableQuantity,
                            })
                          : text("outOfStock")
                      }
                    />
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between" }}>
                    <Button
                      size="small"
                      LinkComponent={Link}
                      href={`/products/${p.slug}`}
                    >
                      {text("viewDetails")}
                    </Button>
                    <WishlistButton productId={p.id} />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                page={Math.min(page, totalPages)}
                count={totalPages}
                onChange={(_event, value) => goToPage(value)}
                color="primary"
                showFirstButton
                showLastButton
                aria-label="Product result pages"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

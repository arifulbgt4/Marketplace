"use client";
import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Container,
  Grid,
  Typography,
  CardMedia,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Skeleton,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  Alert,
  Divider,
  Rating,
} from "@mui/material";
import Link from "next/link";
import WishlistButton from "src/components/WishlistButton";
import { useStorefrontSettings } from "src/contexts/StorefrontSettings";
import { useLocale, useTranslations } from "next-intl";
import { formatDateTime, formatMoney } from "src/lib/i18n";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string | null;
  status: string;
  category: { id: string; name: string; slug: string } | null;
  variants: {
    id: string;
    sku: string;
    price: string;
    compareAtPrice: string | null;
    inventory: { onHand: number; reserved: number } | null;
  }[];
  media: { id: string; url: string; alt: string | null; order: number }[];
  options: { id: string; name: string; values: string[] }[];
  createdBy: { id: string; name: string } | null;
}

type ReviewData = {
  id: string;
  rating: number;
  comment: string | null;
  verifiedPurchase: boolean;
  publishedAt: string | null;
  createdAt: string;
  author: { id: string; name: string; image: string | null };
};

type ReviewsResponse = {
  reviews: ReviewData[];
  summary: { average: number; count: number };
};

export default function ProductDetailClient({ slug }: { slug: string }) {
  const locale = useLocale();
  const reviewsText = useTranslations("Reviews");
  const productText = useTranslations("Product");
  const settings = useStorefrontSettings();
  const currency = settings?.business.defaultCurrency ?? "USD";
  const [product, setProduct] = useState<ProductData | null>(null);
  const [reviews, setReviews] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState<{
    severity: "success" | "error";
    text: string;
  } | null>(null);

  const addToCart = async (variantId: string) => {
    setAdding(variantId);
    setCartMessage(null);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity: 1 }),
      });
      const data = await response.json();
      setCartMessage(
        response.ok
          ? { severity: "success", text: productText("addedToCart") }
          : {
              severity: "error",
              text: data.message ?? productText("addError"),
            },
      );
    } catch {
      setCartMessage({ severity: "error", text: productText("addError") });
    } finally {
      setAdding(null);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/catalog?slug=${slug}`);
        if (res.ok) setProduct(await res.json());
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    let active = true;
    const loadReviews = async () => {
      const response = await fetch(`/api/products/${product.id}/reviews`);
      if (!response.ok) return;
      const data = (await response.json()) as ReviewsResponse;
      if (active) setReviews(data);
    };
    void loadReviews();
    return () => {
      active = false;
    };
  }, [product]);

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
        <Typography variant="h4" color="error">
          {productText("notFound")}
        </Typography>
        <MuiLink component={Link} href="/products">
          {productText("backToProducts")}
        </MuiLink>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink component={Link} href="/" underline="hover" color="inherit">
          {productText("home")}
        </MuiLink>
        <MuiLink
          component={Link}
          href="/products"
          underline="hover"
          color="inherit"
        >
          {productText("products")}
        </MuiLink>
        {product.category && (
          <MuiLink
            component={Link}
            href={`/products?categoryId=${product.category.id}`}
            underline="hover"
            color="inherit"
          >
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
              loading="eager"
              fetchPriority="high"
              sx={{
                width: "100%",
                maxHeight: 500,
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: 400,
                bgcolor: "grey.100",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
              }}
            >
              <Typography color="text.secondary">
                {productText("noImage")}
              </Typography>
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
                  loading="lazy"
                  decoding="async"
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 1,
                    cursor: "pointer",
                  }}
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
          <Typography variant="h3" gutterBottom>
            {product.name}
          </Typography>
          {reviews ? (
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <Rating
                value={reviews.summary.average}
                precision={0.1}
                readOnly
                aria-label={`${reviews.summary.average.toFixed(1)} out of 5`}
              />
              <Typography variant="body2" color="text.secondary">
                {reviews.summary.average.toFixed(1)} (
                {reviewsText("reviewCount", {
                  count: reviews.summary.count,
                })}
                )
              </Typography>
            </Stack>
          ) : null}
          <WishlistButton productId={product.id} />
          {product.category && (
            <Chip label={product.category.name} size="small" sx={{ mb: 2 }} />
          )}

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, whiteSpace: "pre-wrap" }}
          >
            {product.description}
          </Typography>

          <Typography variant="h5" fontWeight={600} gutterBottom>
            {productText("variants")}
          </Typography>
          {cartMessage && (
            <Alert severity={cartMessage.severity} sx={{ mb: 2 }}>
              {cartMessage.text}
            </Alert>
          )}
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table size="small">
              <TableBody>
                {product.variants.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      <strong>{v.sku}</strong>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>
                        {formatMoney(v.price, currency, locale)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="contained"
                        disabled={
                          !v.inventory ||
                          v.inventory.onHand - v.inventory.reserved <= 0 ||
                          adding === v.id
                        }
                        onClick={() => addToCart(v.id)}
                      >
                        {adding === v.id
                          ? productText("adding")
                          : productText("addToCart")}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {v.inventory &&
                      v.inventory.onHand - v.inventory.reserved > 0 ? (
                        <Chip
                          label={productText("inStock")}
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip
                          label={productText("outOfStock")}
                          color="error"
                          size="small"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {product.options.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {productText("options")}
              </Typography>
              {product.options.map((o) => (
                <Typography key={o.id} variant="body2" color="text.secondary">
                  <strong>{o.name}:</strong> {o.values.join(", ")}
                </Typography>
              ))}
            </Box>
          )}

          {product.createdBy && (
            <Typography variant="caption" color="text.secondary">
              {productText("listedBy", { name: product.createdBy.name })}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Divider sx={{ my: 5 }} />
      <Box component="section" aria-labelledby="product-reviews-title">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          gap={1}
          mb={3}
        >
          <Box>
            <Typography id="product-reviews-title" variant="h4">
              {reviewsText("title")}
            </Typography>
            <Typography color="text.secondary">
              {reviewsText("publicDescription")}
            </Typography>
          </Box>
          {reviews?.summary.count ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <Rating
                value={reviews.summary.average}
                precision={0.1}
                readOnly
              />
              <Typography fontWeight={700}>
                {reviews.summary.average.toFixed(1)} / 5
              </Typography>
            </Stack>
          ) : null}
        </Stack>
        {!reviews ? (
          <Skeleton variant="rounded" height={120} />
        ) : reviews.reviews.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography>{reviewsText("empty")}</Typography>
            <Typography variant="body2" color="text.secondary">
              {reviewsText("emptyDescription")}
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {reviews.reviews.map((review) => (
              <Paper key={review.id} variant="outlined" sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar
                    src={review.author.image ?? undefined}
                    alt=""
                    aria-hidden="true"
                  >
                    {review.author.name.slice(0, 1).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      gap={1}
                    >
                      <Box>
                        <Typography fontWeight={700}>
                          {review.author.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Rating
                            value={review.rating}
                            size="small"
                            readOnly
                            aria-label={`${review.rating} out of 5`}
                          />
                          {review.verifiedPurchase ? (
                            <Chip
                              size="small"
                              color="success"
                              variant="outlined"
                              label={reviewsText("verifiedPurchase")}
                            />
                          ) : null}
                        </Stack>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(
                          review.publishedAt ?? review.createdAt,
                          locale,
                        )}
                      </Typography>
                    </Stack>
                    <Typography sx={{ mt: 1.5, whiteSpace: "pre-wrap" }}>
                      {review.comment}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Container>
  );
}

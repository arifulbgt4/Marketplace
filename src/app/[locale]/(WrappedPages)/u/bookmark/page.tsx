"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import WishlistButton from "src/components/WishlistButton";
import { useTranslations } from "next-intl";

type WishlistItem = {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    media: { url: string; alt: string | null }[];
    variants: {
      price: string;
      inventory: { onHand: number; reserved: number } | null;
    }[];
  };
};

export default function WishlistPage() {
  const t = useTranslations("Wishlist");
  const common = useTranslations("Common");
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/wishlist")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message ?? t("loadError"));
        setItems(data.items ?? []);
      })
      .catch((loadError) =>
        setError(
          loadError instanceof Error ? loadError.message : t("loadError"),
        ),
      )
      .finally(() => setLoading(false));
  }, [t]);

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h3">{t("title")}</Typography>
        <Typography color="text.secondary">{t("description")}</Typography>
      </div>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rounded" height={300} />
            </Grid>
          ))}
        </Grid>
      ) : items.length === 0 ? (
        <Stack alignItems="center" spacing={2} py={6}>
          <Typography variant="h6">{t("empty")}</Typography>
          <Button component={Link} href="/products" variant="contained">
            {common("browseProducts")}
          </Button>
        </Stack>
      ) : (
        <Grid container spacing={3}>
          {items.map(({ id, product }) => (
            <Grid item xs={12} sm={6} md={4} key={id}>
              <Card sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height={200}
                  image={
                    product.media[0]?.url ||
                    "https://placehold.co/600x400?text=Product"
                  }
                  alt={product.media[0]?.alt || product.name}
                  loading="lazy"
                  decoding="async"
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography color="text.secondary" noWrap>
                    {product.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between" }}>
                  <Button component={Link} href={`/products/${product.slug}`}>
                    {common("viewProduct")}
                  </Button>
                  <WishlistButton productId={product.id} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}

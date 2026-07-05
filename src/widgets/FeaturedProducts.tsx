"use client";
import { FC, useEffect, useState } from "react";
import {
  Grid,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Skeleton,
  Chip,
} from "@mui/material";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: { id: string; name: string } | null;
  variants: {
    price: string;
    inventory: { onHand: number; reserved: number } | null;
  }[];
  media: { url: string; alt: string | null }[];
}

const FeaturedProducts: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/catalog?featured=true&limit=8");
        if (res.ok) {
          const data = await res.json();
          setProducts(data || []);
        }
      } catch {
        console.error("Failed to fetch featured products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Container>
        <Typography variant="h4" textAlign="center" mb={4}>
          Featured Products
        </Typography>
        <Grid spacing={3} container>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={300} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (products.length === 0) return null;

  const minPrice = (variants: { price: string }[]) => {
    if (variants.length === 0) return 0;
    return Math.min(...variants.map((v) => Number(v.price)));
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" textAlign="center" mb={4}>
        Featured Products
      </Typography>
      <Grid spacing={3} container>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={3} key={p.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height={180}
                image={
                  p.media[0]?.url ||
                  "https://placehold.co/400x400?text=No+Image"
                }
                alt={p.media[0]?.alt || p.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                {p.category && (
                  <Chip label={p.category.name} size="small" sx={{ mb: 1 }} />
                )}
                <Typography variant="subtitle1" fontWeight={600} noWrap>
                  {p.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  From ${minPrice(p.variants).toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  LinkComponent={Link}
                  href={`/products/${p.slug}`}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FeaturedProducts;

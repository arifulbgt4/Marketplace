"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Box, Container, Typography, Card, CardContent, CardMedia,
  Stack, Button, IconButton, TextField, Skeleton, Divider,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Link from "next/link";

interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  sku: string;
  productName: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
}

interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const updateQuantity = async (variantId: string, quantity: number) => {
    setUpdating(variantId);
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (variantId: string) => {
    await updateQuantity(variantId, 0);
  };

  const clearCart = async () => {
    if (!cart) return;
    try {
      await fetch(`/api/cart?cartId=${cart.id}`, { method: "DELETE" });
      setCart({ ...cart, items: [], subtotal: 0 });
    } catch {}
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="text" width={200} height={40} />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={100} sx={{ mb: 2 }} />
        ))}
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <ShoppingCartIcon />
        <Typography variant="h4">Shopping Cart</Typography>
      </Stack>

      {!cart || cart.items.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Browse products and add items to your cart
          </Typography>
          <Button variant="contained" LinkComponent={Link} href="/products">
            Browse Products
          </Button>
        </Paper>
      ) : (
        <>
          {cart.items.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <Stack direction="row" spacing={2} p={2}>
                <CardMedia
                  component="img"
                  image={item.imageUrl || "https://placehold.co/100x100?text=No+Image"}
                  alt={item.productName}
                  sx={{ width: 100, height: 100, borderRadius: 1, objectFit: "cover", flexShrink: 0 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {item.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    SKU: {item.sku}
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="primary" mt={1}>
                    ${Number(item.unitPrice).toFixed(2)}
                  </Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    disabled={updating === item.variantId}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    value={item.quantity}
                    size="small"
                    sx={{ width: 60 }}
                    inputProps={{ min: 0, max: 100, style: { textAlign: "center" } }}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 0) updateQuantity(item.variantId, val);
                    }}
                    disabled={updating === item.variantId}
                  />
                  <IconButton
                    size="small"
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    disabled={updating === item.variantId}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => removeItem(item.variantId)} disabled={updating === item.variantId}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Card>
          ))}

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button color="error" variant="outlined" onClick={clearCart}>
              Clear Cart
            </Button>
            <Box textAlign="right">
              <Typography variant="h5" fontWeight={700}>
                Total: ${(cart.subtotal || 0).toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
                LinkComponent={Link}
                href="/checkout"
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Stack>
        </>
      )}
    </Container>
  );
}

"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Box, Container, Typography, Paper, Stack, Button, TextField,
  Select, MenuItem, FormControl, InputLabel, Divider, Alert,
  Skeleton, Chip, Radio, RadioGroup, FormControlLabel,
} from "@mui/material";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string | null;
}

interface Address {
  id: string;
  label: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface DeliveryMethod {
  id: string;
  zoneId: string;
  name: string;
  code: string;
  carrier: string | null;
  cost: number;
  estimatedDaysMin: number | null;
  estimatedDaysMax: number | null;
}

interface CouponResult {
  valid: boolean;
  coupon: {
    id: string;
    code: string;
    discountType: string;
    discountValue: number;
  };
}

interface CheckoutSession {
  id: string;
  cartId: string;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  couponId: string | null;
  deliveryMethodId: string | null;
  shippingAddressId: string | null;
  status: string;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<{ id: string; items: CartItem[]; subtotal: number } | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [notes, setNotes] = useState("");

  const fetchCart = useCallback(async () => {
    const res = await fetch("/api/cart");
    if (res.ok) return res.json();
    return null;
  }, []);

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch("/api/address");
      if (res.ok) return res.json();
    } catch {}
    return [];
  }, []);

  useEffect(() => {
    (async () => {
      const [cartData, addrData] = await Promise.all([fetchCart(), fetchAddresses()]);
      setCart(cartData);
      setAddresses(addrData.addresses || addrData || []);
      if (cartData && cartData.items && cartData.items.length > 0) {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartId: cartData.id }),
        });
        if (res.ok) {
          const sess = await res.json();
          setSession(sess);
          setSelectedMethod(sess.deliveryMethodId || "");
        }
      }
      setLoading(false);
    })();
  }, [fetchCart, fetchAddresses]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponMsg(null);
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
          userId: "current",
          subtotal: cart?.subtotal || 0,
          productIds: cart?.items.map((i) => i.productId) || [],
        }),
      });
      if (res.ok) {
        const data: CouponResult = await res.json();
        if (data.valid && session) {
          const sessRes = await fetch(`/api/checkout/${session.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ couponCode: couponCode.trim() }),
          });
          if (sessRes.ok) {
            const updated = await sessRes.json();
            setSession(updated);
            setCouponApplied(true);
            setCouponMsg({ type: "success", text: "Coupon applied!" });
          }
        }
      } else {
        const err = await res.json();
        setCouponMsg({ type: "error", text: err.message || "Invalid coupon" });
      }
    } catch {
      setCouponMsg({ type: "error", text: "Failed to validate coupon" });
    }
  };

  const selectDelivery = async (methodId: string) => {
    setSelectedMethod(methodId);
    if (!session) return;
    const res = await fetch(`/api/checkout/${session.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveryMethodId: methodId }),
    });
    if (res.ok) {
      const updated = await res.json();
      setSession(updated);
    }
  };

  const selectAddress = async (addressId: string) => {
    setSelectedAddress(addressId);
    if (!session) return;
    await fetch(`/api/checkout/${session.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shippingAddressId: addressId }),
    });
  };

  useEffect(() => {
    if (!selectedAddress) return;
    const selectedAddr = addresses.find((a) => a.id === selectedAddress);
    if (!selectedAddr) return;
    (async () => {
      const res = await fetch(`/api/delivery/zones?country=${selectedAddr.country}&subtotal=${cart?.subtotal || 0}`);
      if (res.ok) {
        const data = await res.json();
        if (data.eligible) {
          setDeliveryMethods(data.methods || []);
        }
      }
    })();
  }, [selectedAddress, addresses, cart?.subtotal]);

  const placeOrder = async () => {
    if (!session) return;
    setPlacing(true);
    try {
      const res = await fetch("/api/checkout/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkoutSessionId: session.id,
          idempotencyKey: uuidv4(),
          paymentMethod: "cod",
          notes: notes || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        window.location.href = `/orders/${data.orderId}`;
      } else {
        const err = await res.json();
        alert(err.message || "Failed to place order");
      }
    } catch {
      alert("Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="text" width={200} height={40} />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={80} sx={{ mb: 2 }} />
        ))}
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Button variant="contained" LinkComponent={Link} href="/products">
            Browse Products
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3}>Checkout</Typography>

      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Order Summary</Typography>
          {cart.items.map((item) => (
            <Stack key={item.id} direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body2">
                {item.productName} x{item.quantity}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
              </Typography>
            </Stack>
          ))}
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography>Subtotal</Typography>
            <Typography fontWeight={600}>${(cart.subtotal || 0).toFixed(2)}</Typography>
          </Stack>
          {session && session.discountAmount > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography color="success.main">Discount</Typography>
              <Typography color="success.main">-${session.discountAmount.toFixed(2)}</Typography>
            </Stack>
          )}
          {session && session.shippingCost > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography>Shipping</Typography>
              <Typography>${session.shippingCost.toFixed(2)}</Typography>
            </Stack>
          )}
          <Divider sx={{ my: 1 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" color="primary">
              ${(session?.totalAmount || cart.subtotal || 0).toFixed(2)}
            </Typography>
          </Stack>
        </Paper>

        {addresses.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Shipping Address</Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={selectedAddress} onChange={(e) => selectAddress(e.target.value)}>
                {addresses.map((addr) => (
                  <FormControlLabel
                    key={addr.id}
                    value={addr.id}
                    control={<Radio />}
                    label={`${addr.label}: ${addr.line1}, ${addr.city}, ${addr.state} ${addr.postalCode}`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>
        )}

        {deliveryMethods.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Delivery Method</Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={selectedMethod} onChange={(e) => selectDelivery(e.target.value)}>
                {deliveryMethods.map((m) => (
                  <FormControlLabel
                    key={m.id}
                    value={m.id}
                    control={<Radio />}
                    label={
                      <Stack>
                        <Typography variant="body2">{m.name} {m.carrier ? `(${m.carrier})` : ""}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ${m.cost.toFixed(2)}
                          {m.estimatedDaysMin ? ` - ${m.estimatedDaysMin}–${m.estimatedDaysMax} days` : ""}
                        </Typography>
                      </Stack>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>
        )}

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Coupon</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              label="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={couponApplied}
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={applyCoupon}
              disabled={couponApplied || !couponCode.trim()}
            >
              Apply
            </Button>
          </Stack>
          {couponMsg && (
            <Alert severity={couponMsg.type} sx={{ mt: 1 }}>{couponMsg.text}</Alert>
          )}
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Notes (Optional)</Typography>
          <TextField
            multiline
            rows={3}
            fullWidth
            placeholder="Add notes to your order..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Paper>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={placeOrder}
          disabled={placing || !session}
        >
          {placing ? "Placing Order..." : `Place Order — $${(session?.totalAmount || 0).toFixed(2)}`}
        </Button>
      </Stack>
    </Container>
  );
}

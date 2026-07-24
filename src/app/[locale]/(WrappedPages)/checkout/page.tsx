"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  Skeleton,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { useLocale, useTranslations } from "next-intl";
import { formatMoney } from "src/lib/i18n";

interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string | null;
  weightGrams: number;
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

interface PaymentMethodOption {
  code: "cod" | "online";
  label: string;
  description: string | null;
  eligible: boolean;
  reasonCode: string | null;
}

export default function CheckoutPage() {
  const locale = useLocale();
  const t = useTranslations("Checkout");
  const common = useTranslations("Common");
  const [cart, setCart] = useState<{
    id: string;
    items: CartItem[];
    subtotal: number;
    totalWeightGrams: number;
  } | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>(
    [],
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "cod" | "online" | ""
  >("");
  const [paymentMethodsError, setPaymentMethodsError] = useState("");
  const [placementError, setPlacementError] = useState("");

  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [notes, setNotes] = useState("");
  const [addingAddress, setAddingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [newAddress, setNewAddress] = useState({
    label: t("home"),
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const currency = session?.currency ?? "USD";
  const paymentUnavailableMessage = (reasonCode: string | null) => {
    if (!reasonCode) return t("paymentUnavailable");
    const key = `reasons.${reasonCode}`;
    return t.has(key) ? t(key) : t("paymentUnavailable");
  };

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

  const refreshPaymentMethods = useCallback(
    async (checkoutSessionId: string) => {
      setPaymentMethodsError("");
      try {
        const response = await fetch(
          `/api/checkout/${checkoutSessionId}/payment-methods`,
        );
        const data = await response.json();
        if (!response.ok) {
          setPaymentMethods([]);
          setSelectedPaymentMethod("");
          setPaymentMethodsError(data.message ?? t("loadPaymentError"));
          return;
        }
        const methods = data as PaymentMethodOption[];
        setPaymentMethods(methods);
        setSelectedPaymentMethod((current) => {
          if (
            current &&
            methods.some((method) => method.code === current && method.eligible)
          ) {
            return current;
          }
          return methods.find((method) => method.eligible)?.code ?? "";
        });
      } catch {
        setPaymentMethods([]);
        setSelectedPaymentMethod("");
        setPaymentMethodsError(t("loadPaymentError"));
      }
    },
    [t],
  );

  useEffect(() => {
    (async () => {
      const [cartData, addrData] = await Promise.all([
        fetchCart(),
        fetchAddresses(),
      ]);
      setCart(cartData);
      const addressList: Address[] = addrData.addresses || addrData || [];
      const defaultAddress =
        addressList.find((address) => address.isDefault) ?? addressList[0];
      setAddresses(addressList);
      setSelectedAddress(defaultAddress?.id ?? "");
      if (cartData && cartData.items && cartData.items.length > 0) {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartId: cartData.id,
            shippingAddressId: defaultAddress?.id,
          }),
        });
        if (res.ok) {
          const sess = await res.json();
          setSession(sess);
          setSelectedMethod(sess.deliveryMethodId || "");
          await refreshPaymentMethods(sess.id);
        }
      }
      setLoading(false);
    })();
  }, [fetchAddresses, fetchCart, refreshPaymentMethods]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponMsg(null);
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
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
            await refreshPaymentMethods(updated.id);
            setCouponApplied(true);
            setCouponMsg({ type: "success", text: t("couponApplied") });
          }
        }
      } else {
        const err = await res.json();
        setCouponMsg({
          type: "error",
          text: err.message || t("invalidCoupon"),
        });
      }
    } catch {
      setCouponMsg({ type: "error", text: t("couponValidationError") });
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
      await refreshPaymentMethods(updated.id);
    }
  };

  const selectAddress = async (addressId: string) => {
    setSelectedAddress(addressId);
    setSelectedMethod("");
    setDeliveryMethods([]);
    setPaymentMethods([]);
    setSelectedPaymentMethod("");
    if (!session) return;
    const res = await fetch(`/api/checkout/${session.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shippingAddressId: addressId,
        deliveryMethodId: null,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setSession(updated);
      await refreshPaymentMethods(updated.id);
    }
  };

  const createAddress = async () => {
    setAddressError("");
    setAddingAddress(true);
    try {
      const res = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAddress,
          type: "shipping",
          isDefault: addresses.length === 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddressError(data.message || t("saveAddressError"));
        return;
      }
      setAddresses((current) => [...current, data]);
      await selectAddress(data.id);
      setNewAddress({
        label: t("home"),
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
      });
    } catch {
      setAddressError(t("saveAddressError"));
    } finally {
      setAddingAddress(false);
    }
  };

  useEffect(() => {
    if (!selectedAddress) return;
    const selectedAddr = addresses.find((a) => a.id === selectedAddress);
    if (!selectedAddr) return;
    (async () => {
      const res = await fetch(
        `/api/delivery/zones?country=${encodeURIComponent(selectedAddr.country)}&region=${encodeURIComponent(selectedAddr.state)}&postalCode=${encodeURIComponent(selectedAddr.postalCode)}&subtotal=${cart?.subtotal || 0}&weightGrams=${cart?.totalWeightGrams || 0}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data.eligible) {
          setDeliveryMethods(data.methods || []);
        }
      }
    })();
  }, [selectedAddress, addresses, cart?.subtotal, cart?.totalWeightGrams]);

  const placeOrder = async () => {
    if (!session) return;
    setPlacing(true);
    setPlacementError("");
    try {
      const res = await fetch("/api/checkout/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkoutSessionId: session.id,
          idempotencyKey: uuidv4(),
          paymentMethod: selectedPaymentMethod,
          notes: notes || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        window.location.href = `/u/order/${data.orderId}${
          data.paymentMethod === "online" ? "?payment=pending" : ""
        }`;
      } else {
        const err = await res.json();
        setPlacementError(err.message || t("placeOrderError"));
      }
    } catch {
      setPlacementError(t("placeOrderError"));
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
            {t("emptyCart")}
          </Typography>
          <Button variant="contained" LinkComponent={Link} href="/products">
            {common("browseProducts")}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" mb={3}>
        {t("title")}
      </Typography>

      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            {t("orderSummary")}
          </Typography>
          {cart.items.map((item) => (
            <Stack
              key={item.id}
              direction="row"
              justifyContent="space-between"
              mb={1}
            >
              <Typography variant="body2">
                {item.productName} x{item.quantity}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatMoney(
                  Number(item.unitPrice) * item.quantity,
                  currency,
                  locale,
                )}
              </Typography>
            </Stack>
          ))}
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography>{t("subtotal")}</Typography>
            <Typography fontWeight={600}>
              {formatMoney(cart.subtotal || 0, currency, locale)}
            </Typography>
          </Stack>
          {session && session.discountAmount > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography color="success.main">{t("discount")}</Typography>
              <Typography color="success.main">
                -{formatMoney(session.discountAmount, currency, locale)}
              </Typography>
            </Stack>
          )}
          {session && session.shippingCost > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography>{t("shipping")}</Typography>
              <Typography>
                {formatMoney(session.shippingCost, currency, locale)}
              </Typography>
            </Stack>
          )}
          <Divider sx={{ my: 1 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">{t("total")}</Typography>
            <Typography variant="h6" color="primary">
              {formatMoney(
                session?.totalAmount || cart.subtotal || 0,
                currency,
                locale,
              )}
            </Typography>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            {t("shippingAddress")}
          </Typography>
          {addresses.length > 0 && (
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedAddress}
                onChange={(e) => selectAddress(e.target.value)}
              >
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
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" mb={1}>
            {t("addAddress")}
          </Typography>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label={t("label")}
                value={newAddress.label}
                onChange={(event) =>
                  setNewAddress({ ...newAddress, label: event.target.value })
                }
                fullWidth
              />
              <TextField
                label={t("countryCode")}
                value={newAddress.country}
                onChange={(event) =>
                  setNewAddress({
                    ...newAddress,
                    country: event.target.value.toUpperCase(),
                  })
                }
                inputProps={{ maxLength: 2 }}
                helperText={t("countryHint")}
                required
                fullWidth
              />
            </Stack>
            <TextField
              label={t("addressLine1")}
              value={newAddress.line1}
              onChange={(event) =>
                setNewAddress({ ...newAddress, line1: event.target.value })
              }
              required
              fullWidth
            />
            <TextField
              label={t("addressLine2")}
              value={newAddress.line2}
              onChange={(event) =>
                setNewAddress({ ...newAddress, line2: event.target.value })
              }
              fullWidth
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {(["city", "state", "postalCode"] as const).map((field) => (
                <TextField
                  key={field}
                  label={
                    field === "postalCode"
                      ? t("postalCode")
                      : field === "city"
                        ? t("city")
                        : t("state")
                  }
                  value={newAddress[field]}
                  onChange={(event) =>
                    setNewAddress({
                      ...newAddress,
                      [field]: event.target.value,
                    })
                  }
                  required
                  fullWidth
                />
              ))}
            </Stack>
            <TextField
              label={t("phone")}
              value={newAddress.phone}
              onChange={(event) =>
                setNewAddress({ ...newAddress, phone: event.target.value })
              }
              fullWidth
            />
            {addressError && <Alert severity="error">{addressError}</Alert>}
            <Button
              variant="outlined"
              onClick={createAddress}
              disabled={
                addingAddress ||
                !newAddress.line1.trim() ||
                !newAddress.city.trim() ||
                !newAddress.state.trim() ||
                !newAddress.postalCode.trim() ||
                newAddress.country.trim().length !== 2
              }
            >
              {addingAddress ? common("saving") : t("saveAddress")}
            </Button>
          </Stack>
        </Paper>

        {deliveryMethods.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              {t("deliveryMethod")}
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedMethod}
                onChange={(e) => selectDelivery(e.target.value)}
              >
                {deliveryMethods.map((m) => (
                  <FormControlLabel
                    key={m.id}
                    value={m.id}
                    control={<Radio />}
                    label={
                      <Stack>
                        <Typography variant="body2">
                          {m.name} {m.carrier ? `(${m.carrier})` : ""}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatMoney(m.cost, currency, locale)}
                          {m.estimatedDaysMin
                            ? ` - ${m.estimatedDaysMin}–${m.estimatedDaysMax} days`
                            : ""}
                        </Typography>
                      </Stack>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>
        )}

        {session ? (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              {t("paymentMethod")}
            </Typography>
            {paymentMethodsError ? (
              <Alert severity="error">{paymentMethodsError}</Alert>
            ) : paymentMethods.length === 0 ? (
              <Alert severity="info">{t("loadingPaymentMethods")}</Alert>
            ) : (
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedPaymentMethod}
                  onChange={(event) =>
                    setSelectedPaymentMethod(
                      event.target.value as "cod" | "online",
                    )
                  }
                >
                  {paymentMethods.map((method) => (
                    <FormControlLabel
                      key={method.code}
                      value={method.code}
                      disabled={!method.eligible}
                      control={<Radio />}
                      label={
                        <Stack>
                          <Typography variant="body2">
                            {method.label}
                          </Typography>
                          {method.description ? (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {method.description}
                            </Typography>
                          ) : null}
                          {!method.eligible ? (
                            <Typography variant="caption" color="error">
                              {paymentUnavailableMessage(method.reasonCode)}
                            </Typography>
                          ) : null}
                        </Stack>
                      }
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          </Paper>
        ) : null}

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            {t("coupon")}
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              label={t("couponCode")}
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
              {t("apply")}
            </Button>
          </Stack>
          {couponMsg && (
            <Alert severity={couponMsg.type} sx={{ mt: 1 }}>
              {couponMsg.text}
            </Alert>
          )}
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            {t("notes")}
          </Typography>
          <TextField
            multiline
            rows={3}
            fullWidth
            placeholder={t("notesPlaceholder")}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Paper>

        {placementError ? (
          <Alert severity="error" aria-live="assertive">
            {placementError}
          </Alert>
        ) : null}

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={placeOrder}
          disabled={
            placing ||
            !session ||
            !selectedAddress ||
            !selectedMethod ||
            !selectedPaymentMethod
          }
        >
          {placing
            ? t("placingOrder")
            : `${t("placeOrder")} — ${formatMoney(
                session?.totalAmount || 0,
                currency,
                locale,
              )}`}
        </Button>
      </Stack>
    </Container>
  );
}

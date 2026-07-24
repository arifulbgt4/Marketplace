"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { formatDateTime, formatMoney } from "src/lib/i18n";

type OrderDetail = {
  id: string;
  orderNo: string;
  orderStatus: string;
  statusVersion: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  totalPrice: string;
  subtotal: string | null;
  shippingCost: string | null;
  discountAmount: string | null;
  currency: string;
  shippingAddress: Record<string, unknown> | null;
  items: {
    id: string;
    productId: string | null;
    sku: string;
    productName: string;
    unitPrice: string;
    totalPrice: string;
    quantity: number;
    review: {
      id: string;
      rating: number;
      comment: string | null;
      status: string;
      verifiedPurchase: boolean;
    } | null;
  }[];
  shipments: {
    id: string;
    status: string;
    carrier: string | null;
    trackingNumber: string | null;
    estimatedDeliveryAt: string | null;
  }[];
  returns: {
    id: string;
    status: string;
    reason: string;
    refundAmount: string | null;
  }[];
  timeline: {
    id: string;
    kind: string;
    fromOrderStatus: string | null;
    toOrderStatus: string | null;
    fromFulfillmentStatus: string | null;
    toFulfillmentStatus: string | null;
    createdAt: string;
  }[];
};

async function post(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "Action failed");
}

export default function CustomerOrderDetailPage() {
  const locale = useLocale();
  const t = useTranslations("OrderDetail");
  const money = (value: string | null, currency: string) =>
    formatMoney(value ?? 0, currency, locale);
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [reviewItem, setReviewItem] = useState<
    OrderDetail["items"][number] | null
  >(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Unable to load order");
      setOrder(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load order",
      );
    }
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (action: () => Promise<void>, message: string) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(message);
      setReason("");
      await load();
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : "Action failed",
      );
    } finally {
      setBusy(false);
    }
  };

  const openReview = (item: OrderDetail["items"][number]) => {
    setReviewItem(item);
    setReviewRating(item.review?.rating ?? 5);
    setReviewComment(item.review?.comment ?? "");
    setError("");
    setNotice("");
  };

  const saveReview = async () => {
    if (!reviewItem?.productId) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const url = reviewItem.review
        ? `/api/products/${reviewItem.productId}/reviews/${reviewItem.review.id}`
        : `/api/products/${reviewItem.productId}/reviews`;
      const response = await fetch(url, {
        method: reviewItem.review ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...(reviewItem.review ? {} : { orderItemId: reviewItem.id }),
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message ?? "Unable to save your review");
      }
      setReviewItem(null);
      setNotice(
        reviewItem.review
          ? "Your updated review was submitted for moderation."
          : "Your review was submitted for moderation.",
      );
      await load();
    } catch (reviewError) {
      setError(
        reviewError instanceof Error
          ? reviewError.message
          : "Unable to save your review",
      );
    } finally {
      setBusy(false);
    }
  };

  if (!order) {
    return error ? (
      <Alert severity="error">{error}</Alert>
    ) : (
      <Typography>{t("loading")}</Typography>
    );
  }

  const canCancel =
    ["pending", "confirmed"].includes(order.orderStatus) &&
    !["SHIPPED", "DELIVERED", "RETURNED"].includes(order.fulfillmentStatus);
  const canReturn =
    order.fulfillmentStatus === "DELIVERED" &&
    !order.returns.some((request) =>
      ["REQUESTED", "APPROVED", "RECEIVED"].includes(request.status),
    );

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3">{order.orderNo}</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
          <Chip label={order.orderStatus} />
          <Chip label={order.paymentStatus} />
          <Chip label={order.fulfillmentStatus} />
        </Stack>
      </Box>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {notice ? <Alert severity="success">{notice}</Alert> : null}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">{t("items")}</Typography>
            <List disablePadding>
              {order.items.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemText
                    primary={item.productName}
                    secondary={`${item.sku} · ${item.quantity} × ${money(
                      item.unitPrice,
                      order.currency,
                    )}`}
                  />
                  <Stack alignItems="flex-end" spacing={0.5}>
                    <Typography>
                      {money(item.totalPrice, order.currency)}
                    </Typography>
                    {["DELIVERED", "RETURNED"].includes(
                      order.fulfillmentStatus,
                    ) && item.productId ? (
                      <Button size="small" onClick={() => openReview(item)}>
                        {item.review ? t("editReview") : t("writeReview")}
                      </Button>
                    ) : null}
                    {item.review ? (
                      <Chip
                        size="small"
                        variant="outlined"
                        label={t("reviewStatus", {
                          status: item.review.status.toLowerCase(),
                        })}
                      />
                    ) : null}
                  </Stack>
                </ListItem>
              ))}
            </List>
            <Stack alignItems="flex-end" spacing={0.5} mt={2}>
              <Typography>
                {t("subtotal", {
                  amount: money(order.subtotal, order.currency),
                })}
              </Typography>
              <Typography>
                {t("shipping", {
                  amount: money(order.shippingCost, order.currency),
                })}
              </Typography>
              <Typography>
                {t("discount", {
                  amount: money(order.discountAmount, order.currency),
                })}
              </Typography>
              <Typography variant="h6">
                {t("total", {
                  amount: money(order.totalPrice, order.currency),
                })}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6">{t("deliveryAddress")}</Typography>
            <Typography component="div" sx={{ whiteSpace: "pre-line" }}>
              {order.shippingAddress
                ? [
                    order.shippingAddress.line1,
                    order.shippingAddress.line2,
                    order.shippingAddress.city,
                    order.shippingAddress.state,
                    order.shippingAddress.postalCode,
                    order.shippingAddress.country,
                    order.shippingAddress.phone,
                  ]
                    .filter(Boolean)
                    .join("\n")
                : t("noAddress")}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {order.shipments.length ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">{t("deliveryProgress")}</Typography>
          <List>
            {order.shipments.map((shipment) => (
              <ListItem key={shipment.id} divider>
                <ListItemText
                  primary={shipment.status}
                  secondary={
                    [shipment.carrier, shipment.trackingNumber]
                      .filter(Boolean)
                      .join(" · ") || t("trackingPending")
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : null}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">{t("help")}</Typography>
        <TextField
          fullWidth
          multiline
          minRows={2}
          label={canReturn ? t("returnReason") : t("cancellationReason")}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          sx={{ my: 2 }}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          {canCancel ? (
            <Button
              color="error"
              variant="outlined"
              disabled={busy || reason.trim().length < 3}
              onClick={() =>
                run(
                  () =>
                    post(`/api/orders/${order.id}/cancel`, {
                      reason,
                      expectedVersion: order.statusVersion,
                    }),
                  t("cancelledNotice"),
                )
              }
            >
              {t("cancelOrder")}
            </Button>
          ) : null}
          {canReturn ? (
            <Button
              variant="outlined"
              disabled={busy || reason.trim().length < 3}
              onClick={() =>
                run(
                  () =>
                    post(`/api/orders/${order.id}/returns`, {
                      reason,
                      items: order.items.map((item) => ({
                        orderItemId: item.id,
                        quantity: item.quantity,
                        reason,
                      })),
                    }),
                  t("returnNotice"),
                )
              }
            >
              {t("requestReturn")}
            </Button>
          ) : null}
          {!canCancel && !canReturn ? (
            <Typography color="text.secondary">{t("outsideWindow")}</Typography>
          ) : null}
        </Stack>
      </Paper>

      {order.returns.length ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">{t("returns")}</Typography>
          <List>
            {order.returns.map((request) => (
              <ListItem key={request.id} divider>
                <ListItemText
                  primary={request.status}
                  secondary={request.reason}
                />
                {request.refundAmount ? (
                  <Typography>
                    {money(request.refundAmount, order.currency)}
                  </Typography>
                ) : null}
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : null}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">{t("timeline")}</Typography>
        <List>
          {order.timeline.map((entry) => (
            <ListItem key={entry.id} divider>
              <ListItemText
                primary={
                  entry.kind === "ORDER"
                    ? `${entry.fromOrderStatus ?? "created"} → ${entry.toOrderStatus}`
                    : `${entry.fromFulfillmentStatus ?? "created"} → ${entry.toFulfillmentStatus}`
                }
                secondary={formatDateTime(entry.createdAt, locale)}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog
        open={Boolean(reviewItem)}
        onClose={() => !busy && setReviewItem(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {reviewItem?.review ? t("editYourReview") : t("reviewProduct")}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Typography fontWeight={600}>{reviewItem?.productName}</Typography>
            <Box>
              <Typography component="label" id="review-rating-label">
                {t("rating")}
              </Typography>
              <Rating
                aria-labelledby="review-rating-label"
                value={reviewRating}
                onChange={(_event, value) => setReviewRating(value ?? 1)}
              />
            </Box>
            <TextField
              required
              label={t("review")}
              value={reviewComment}
              onChange={(event) => setReviewComment(event.target.value)}
              multiline
              minRows={4}
              inputProps={{ maxLength: 2000 }}
              helperText={t("characterCount", {
                count: reviewComment.length,
              })}
            />
            <Alert severity="info">{t("moderationNotice")}</Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewItem(null)} disabled={busy}>
            {t("cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={() => void saveReview()}
            disabled={busy || reviewComment.trim().length < 3}
          >
            {busy ? t("submitting") : t("submitReview")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type OrderItem = {
  id: string;
  sku: string;
  productName: string;
  unitPrice: string;
  totalPrice: string;
  quantity: number;
};

type Shipment = {
  id: string;
  status: string;
  carrier: string | null;
  trackingNumber: string | null;
  items: { orderItemId: string; quantity: number }[];
};

type ReturnRequest = {
  id: string;
  status: string;
  reason: string;
  refundAmount: string | null;
  items: { orderItemId: string; quantity: number }[];
};

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
  paymentMethod: string | null;
  shippingAddress: Record<string, unknown> | null;
  customer: { name: string; email: string; phone: string | null };
  items: OrderItem[];
  shipments: Shipment[];
  returns: ReturnRequest[];
  timeline: {
    id: string;
    kind: string;
    fromOrderStatus: string | null;
    toOrderStatus: string | null;
    fromFulfillmentStatus: string | null;
    toFulfillmentStatus: string | null;
    reason: string | null;
    createdAt: string;
  }[];
};

function money(value: string | null, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(Number(value ?? 0));
}

async function apiAction(
  url: string,
  method: string,
  body: unknown,
  headers: Record<string, string> = {},
) {
  const response = await fetch(url, {
    method,
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "Action failed");
  return data;
}

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reason, setReason] = useState("Operator update");
  const [carrier, setCarrier] = useState("");
  const [tracking, setTracking] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/orders/${id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Unable to load order");
      setOrder(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load order",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const remainingItems = useMemo(() => {
    if (!order) return [];
    const allocated = new Map<string, number>();
    for (const shipment of order.shipments) {
      if (shipment.status === "CANCELLED") continue;
      for (const item of shipment.items) {
        allocated.set(
          item.orderItemId,
          (allocated.get(item.orderItemId) ?? 0) + item.quantity,
        );
      }
    }
    return order.items.flatMap((item) => {
      const quantity = item.quantity - (allocated.get(item.id) ?? 0);
      return quantity > 0 ? [{ orderItemId: item.id, quantity }] : [];
    });
  }, [order]);

  const run = async (action: () => Promise<unknown>, message: string) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(message);
      await load();
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : "Action failed",
      );
    } finally {
      setBusy(false);
    }
  };

  if (loading && !order) return <Typography>Loading order…</Typography>;
  if (!order) return <Alert severity="error">{error || "Order not found"}</Alert>;

  const transition = (status: string) =>
    run(
      () =>
        apiAction(`/api/admin/orders/${order.id}/transition`, "POST", {
          kind: "ORDER",
          status,
          reason,
          expectedVersion: order.statusVersion,
        }),
      `Order moved to ${status}.`,
    );

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        gap={2}
      >
        <Box>
          <Typography variant="h4">{order.orderNo}</Typography>
          <Typography color="text.secondary">
            {order.customer.name} · {order.customer.email}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label={`Order: ${order.orderStatus}`} />
          <Chip label={`Payment: ${order.paymentStatus}`} />
          <Chip label={`Fulfillment: ${order.fulfillmentStatus}`} />
        </Stack>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {notice ? <Alert severity="success">{notice}</Alert> : null}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order actions
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            size="small"
            label="Reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
          {order.orderStatus === "pending" ? (
            <Button
              disabled={busy}
              variant="contained"
              onClick={() => transition("confirmed")}
            >
              Confirm
            </Button>
          ) : null}
          {order.orderStatus === "confirmed" &&
          order.fulfillmentStatus === "DELIVERED" ? (
            <Button
              disabled={busy}
              variant="contained"
              onClick={() => transition("completed")}
            >
              Complete
            </Button>
          ) : null}
          {["pending", "confirmed"].includes(order.orderStatus) &&
          !["SHIPPED", "DELIVERED", "RETURNED"].includes(
            order.fulfillmentStatus,
          ) ? (
            <Button
              disabled={busy || reason.trim().length < 3}
              color="error"
              onClick={() =>
                run(
                  () =>
                    apiAction(
                      `/api/admin/orders/${order.id}/cancel`,
                      "POST",
                      {
                        reason,
                        expectedVersion: order.statusVersion,
                      },
                    ),
                  "Order cancelled.",
                )
              }
            >
              Cancel
            </Button>
          ) : null}
          {order.paymentStatus === "PENDING_COLLECTION" ? (
            <Button
              disabled={busy}
              onClick={() =>
                run(
                  () =>
                    apiAction(
                      `/api/admin/orders/${order.id}/collect`,
                      "POST",
                      {
                        collectedAmount: Number(order.totalPrice),
                        currency: order.currency,
                        notes: reason,
                      },
                      { "Idempotency-Key": crypto.randomUUID() },
                    ),
                  "COD collection recorded.",
                )
              }
            >
              Mark COD collected
            </Button>
          ) : null}
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Items</Typography>
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
                  <Typography>
                    {money(item.totalPrice, order.currency)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Stack alignItems="flex-end" spacing={0.5} mt={2}>
              <Typography>
                Subtotal: {money(order.subtotal, order.currency)}
              </Typography>
              <Typography>
                Shipping: {money(order.shippingCost, order.currency)}
              </Typography>
              <Typography>
                Discount: −{money(order.discountAmount, order.currency)}
              </Typography>
              <Typography variant="h6">
                Total: {money(order.totalPrice, order.currency)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6">Delivery address</Typography>
            {order.shippingAddress ? (
              <Typography component="pre" sx={{ whiteSpace: "pre-wrap" }}>
                {[
                  order.shippingAddress.line1,
                  order.shippingAddress.line2,
                  order.shippingAddress.city,
                  order.shippingAddress.state,
                  order.shippingAddress.postalCode,
                  order.shippingAddress.country,
                  order.shippingAddress.phone,
                ]
                  .filter(Boolean)
                  .join("\n")}
              </Typography>
            ) : (
              <Typography color="text.secondary">No address snapshot.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Shipments
        </Typography>
        {order.orderStatus === "confirmed" && remainingItems.length ? (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
            <TextField
              size="small"
              label="Carrier"
              value={carrier}
              onChange={(event) => setCarrier(event.target.value)}
            />
            <TextField
              size="small"
              label="Tracking number"
              value={tracking}
              onChange={(event) => setTracking(event.target.value)}
            />
            <Button
              variant="outlined"
              disabled={busy}
              onClick={() =>
                run(
                  () =>
                    apiAction(
                      `/api/admin/orders/${order.id}/shipments`,
                      "POST",
                      {
                        carrier: carrier || undefined,
                        trackingNumber: tracking || undefined,
                        items: remainingItems,
                      },
                    ),
                  "Shipment created.",
                )
              }
            >
              Create shipment
            </Button>
          </Stack>
        ) : null}
        <Stack spacing={2}>
          {order.shipments.length === 0 ? (
            <Typography color="text.secondary">No shipments yet.</Typography>
          ) : (
            order.shipments.map((shipment) => (
              <Paper variant="outlined" sx={{ p: 2 }} key={shipment.id}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  gap={2}
                >
                  <Box>
                    <Typography fontWeight={600}>{shipment.status}</Typography>
                    <Typography color="text.secondary">
                      {[shipment.carrier, shipment.trackingNumber]
                        .filter(Boolean)
                        .join(" · ") || "Tracking not assigned"}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    {shipment.status === "PENDING" ? (
                      <Button
                        disabled={busy}
                        onClick={() =>
                          run(
                            () =>
                              apiAction(
                                `/api/admin/shipments/${shipment.id}`,
                                "PATCH",
                                { status: "PROCESSING", reason },
                              ),
                            "Shipment is processing.",
                          )
                        }
                      >
                        Pack
                      </Button>
                    ) : null}
                    {shipment.status === "PROCESSING" ? (
                      <Button
                        disabled={busy || !shipment.trackingNumber}
                        onClick={() =>
                          run(
                            () =>
                              apiAction(
                                `/api/admin/shipments/${shipment.id}`,
                                "PATCH",
                                { status: "SHIPPED", reason },
                              ),
                            "Shipment dispatched.",
                          )
                        }
                      >
                        Ship
                      </Button>
                    ) : null}
                    {shipment.status === "SHIPPED" ? (
                      <Button
                        disabled={busy}
                        onClick={() =>
                          run(
                            () =>
                              apiAction(
                                `/api/admin/shipments/${shipment.id}`,
                                "PATCH",
                                { status: "DELIVERED", reason },
                              ),
                            "Shipment delivered.",
                          )
                        }
                      >
                        Deliver
                      </Button>
                    ) : null}
                  </Stack>
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      </Paper>

      {order.returns.length ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Returns</Typography>
          <Stack spacing={2} mt={2}>
            {order.returns.map((returnRequest) => (
              <Paper variant="outlined" sx={{ p: 2 }} key={returnRequest.id}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  gap={2}
                >
                  <Box>
                    <Typography fontWeight={600}>
                      {returnRequest.status}
                    </Typography>
                    <Typography>{returnRequest.reason}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    {returnRequest.status === "REQUESTED" ? (
                      <>
                        <Button
                          disabled={busy}
                          onClick={() =>
                            run(
                              () =>
                                apiAction(
                                  `/api/admin/returns/${returnRequest.id}`,
                                  "PATCH",
                                  {
                                    status: "APPROVED",
                                    resolutionNote: reason,
                                  },
                                ),
                              "Return approved.",
                            )
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          color="error"
                          disabled={busy}
                          onClick={() =>
                            run(
                              () =>
                                apiAction(
                                  `/api/admin/returns/${returnRequest.id}`,
                                  "PATCH",
                                  {
                                    status: "REJECTED",
                                    resolutionNote: reason,
                                  },
                                ),
                              "Return rejected.",
                            )
                          }
                        >
                          Reject
                        </Button>
                      </>
                    ) : null}
                    {returnRequest.status === "APPROVED" ? (
                      <Button
                        disabled={busy}
                        onClick={() =>
                          run(
                            () =>
                              apiAction(
                                `/api/admin/returns/${returnRequest.id}`,
                                "PATCH",
                                {
                                  status: "RECEIVED",
                                  resolutionNote: reason,
                                },
                              ),
                            "Returned items received.",
                          )
                        }
                      >
                        Mark received
                      </Button>
                    ) : null}
                    {returnRequest.status === "RECEIVED" ? (
                      <Button
                        disabled={busy}
                        onClick={() =>
                          run(
                            () =>
                              apiAction(
                                `/api/admin/returns/${returnRequest.id}`,
                                "PATCH",
                                {
                                  status: "COMPLETED",
                                  resolutionNote: reason,
                                },
                              ),
                            "Return completed.",
                          )
                        }
                      >
                        Complete
                      </Button>
                    ) : null}
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Paper>
      ) : null}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Timeline</Typography>
        <List>
          {order.timeline.map((entry) => (
            <ListItem key={entry.id} divider>
              <ListItemText
                primary={
                  entry.kind === "ORDER"
                    ? `${entry.fromOrderStatus ?? "created"} → ${entry.toOrderStatus}`
                    : `${entry.fromFulfillmentStatus ?? "created"} → ${entry.toFulfillmentStatus}`
                }
                secondary={`${entry.reason ?? "State updated"} · ${new Date(
                  entry.createdAt,
                ).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Typography variant="caption" color="text.secondary">
          Status version {order.statusVersion}
        </Typography>
      </Paper>
    </Stack>
  );
}

"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField,
  Stack, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert,
} from "@mui/material";

interface InventoryItem {
  variant: { id: string; sku: string; product: { id: string; name: string } };
  onHand: number;
  reserved: number;
  lowStockThreshold: number;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [adjustQty, setAdjustQty] = useState("0");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustError, setAdjustError] = useState("");

  const fetchLowStock = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inventory?lowStock=true");
      if (res.ok) setItems(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLowStock(); }, [fetchLowStock]);

  const openAdjust = (variantId: string) => {
    setSelectedVariantId(variantId);
    setAdjustQty("0");
    setAdjustReason("");
    setAdjustError("");
    setAdjustOpen(true);
  };

  const handleAdjust = async () => {
    setAdjustError("");
    const qty = parseInt(adjustQty, 10);
    if (isNaN(qty) || qty === 0) {
      setAdjustError("Quantity must be a non-zero integer");
      return;
    }
    if (!adjustReason) {
      setAdjustError("Reason is required");
      return;
    }

    const res = await fetch("/api/admin/inventory/adjust", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId: selectedVariantId, quantity: qty, reason: adjustReason }),
    });

    if (res.ok) {
      setAdjustOpen(false);
      fetchLowStock();
    } else {
      const err = await res.json();
      setAdjustError(err.message || "Adjustment failed");
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>Inventory (Low Stock)</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>On Hand</TableCell>
              <TableCell>Reserved</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Threshold</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={7}>All stock levels are healthy</TableCell></TableRow>
            ) : items.map((item, idx) => (
              <TableRow key={item.variant?.id || idx}>
                <TableCell>{item.variant?.product?.name || "-"}</TableCell>
                <TableCell>{item.variant?.sku || "-"}</TableCell>
                <TableCell>{item.onHand}</TableCell>
                <TableCell>{item.reserved}</TableCell>
                <TableCell>{item.onHand - item.reserved}</TableCell>
                <TableCell>{item.lowStockThreshold}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" onClick={() => openAdjust(item.variant?.id || "")}>
                    Adjust
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={adjustOpen} onClose={() => setAdjustOpen(false)}>
        <DialogTitle>Adjust Stock</DialogTitle>
        <DialogContent>
          {adjustError && <Alert severity="error" sx={{ mb: 2 }}>{adjustError}</Alert>}
          <Stack spacing={2} mt={1}>
            <TextField
              label="Quantity (positive to add, negative to subtract)"
              type="number"
              value={adjustQty}
              onChange={(e) => setAdjustQty(e.target.value)}
              fullWidth
            />
            <TextField
              label="Reason"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustOpen(false)}>Cancel</Button>
          <Button onClick={handleAdjust} variant="contained">Apply</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  status: string;
  verifiedPurchase: boolean;
  moderationNote: string | null;
  author: { name: string; email: string };
  product: { name: string } | null;
};

const statuses = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "HIDDEN",
  "FLAGGED",
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("Reviewed against marketplace policy");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const query = status ? `?status=${status}` : "";
    const response = await fetch(`/api/admin/reviews${query}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message ?? "Unable to load reviews");
    setReviews(data.reviews ?? []);
  }, [status]);

  useEffect(() => {
    load().catch((loadError) =>
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load reviews",
      ),
    );
  }, [load]);

  const moderate = async (id: string, nextStatus: string) => {
    setError("");
    const response = await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: nextStatus, note }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message ?? "Unable to moderate review");
      return;
    }
    await load();
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Review moderation</Typography>
        <Typography color="text.secondary">
          Moderate visibility without rewriting customer content.
        </Typography>
      </Box>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {statuses.map((item) => (
              <MenuItem value={item} key={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          size="small"
          label="Moderation note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </Stack>
      {reviews.length === 0 ? (
        <Paper sx={{ p: 3 }}>No matching reviews.</Paper>
      ) : (
        reviews.map((review) => (
          <Paper key={review.id} sx={{ p: 3 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              gap={2}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6">
                    {review.product?.name ?? "Legacy listing"} · {review.rating}/5
                  </Typography>
                  <Chip size="small" label={review.status} />
                  {review.verifiedPurchase ? (
                    <Chip size="small" color="success" label="Verified purchase" />
                  ) : null}
                </Stack>
                <Typography sx={{ my: 1 }}>{review.comment}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {review.author.name} · {review.author.email}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button onClick={() => moderate(review.id, "APPROVED")}>
                  Approve
                </Button>
                <Button onClick={() => moderate(review.id, "HIDDEN")}>
                  Hide
                </Button>
                <Button onClick={() => moderate(review.id, "FLAGGED")}>
                  Flag
                </Button>
                <Button
                  color="error"
                  onClick={() => moderate(review.id, "REJECTED")}
                >
                  Reject
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))
      )}
    </Stack>
  );
}

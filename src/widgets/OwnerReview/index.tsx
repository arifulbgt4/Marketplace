"use client";
import { FC } from "react";
import { Grid, Typography, Divider } from "@mui/material";

import Review from "../Review";
import { OwnerReviewProps } from "./Types";

const OwnerReview: FC<OwnerReviewProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <Grid container rowSpacing={3}>
        <Grid item xs={12} display="flex" gap={1}>
          <Typography variant="h5">reviews</Typography>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography color="text.secondary" textAlign="center">
            No reviews yet
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12} display="flex" gap={1}>
        <Typography variant="h5">reviews</Typography>
        <Divider />
      </Grid>
      <Grid item container xs={12} spacing={3}>
        {reviews.map((review) => (
          <Grid key={review.id} item xs={12} md={6}>
            <Review
              id={review.id}
              title={review.author.name}
              subheader={new Date(review.createdAt).toLocaleDateString()}
              description={review.comment || ""}
              img={review.author.image || ""}
              rating={review.rating}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default OwnerReview;

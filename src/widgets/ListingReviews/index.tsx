"use client";
import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import Review from "../Review";

import { ListingReviewsProps } from "./Types";

const ListingReviews: FC<ListingReviewsProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <Typography color="text.secondary" textAlign="center" py={4}>
        No reviews yet
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {reviews.map((review) => (
        <Grid key={review.id} item xs={12} md={4}>
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
  );
};

export default ListingReviews;

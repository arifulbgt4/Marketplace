"use client";
import { FC } from "react";
import { Grid, Typography, Divider } from "@mui/material";

import Review from "../Review";

import { UserReviewsProps } from "./Types";

const UserReviews: FC<UserReviewsProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <Grid container rowSpacing={5}>
        <Grid
          item
          xs={12}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            textAlign="center"
            variant="h2"
            fontFamily="__DM_Sans_048603"
            fontWeight={700}
          >
            What our customer say
          </Typography>
          <Typography textAlign="center" variant="h6" color="text.secondary">
            Check honest reviews from our customer
          </Typography>
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
    <Grid container rowSpacing={5}>
      <Grid
        item
        xs={12}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography
          textAlign="center"
          variant="h2"
          fontFamily="__DM_Sans_048603"
          fontWeight={700}
        >
          What our customer say
        </Typography>
        <Typography textAlign="center" variant="h6" color="text.secondary">
          Check honest reviews from our customer
        </Typography>
        <Divider />
      </Grid>
      <Grid item container xs={12} spacing={5}>
        {reviews.map((review) => (
          <Grid key={review.id} xs={12} item md={4}>
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

export default UserReviews;

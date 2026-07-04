"use client";
import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import Listing from "src/widgets/Listing";

import { BookmarkItemGroupProps } from "./Types";

const BookmarkItemGroup: FC<BookmarkItemGroupProps> = ({ listings }) => {
  if (!listings || listings.length === 0) {
    return (
      <Typography color="text.secondary" textAlign="center" py={4}>
        No bookmarks found
      </Typography>
    );
  }

  return (
    <Grid container spacing={5} justifyContent="center">
      {listings.map((data) => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} xxl={2} key={data.id}>
          <Listing
            isMark={true}
            id={data.id}
            slug={data.slug}
            image={data.images[0] || ""}
            title={data.title}
            address={data.address}
            price={data.price}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default BookmarkItemGroup;

"use client";
import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import Listing from "src/widgets/Listing";

import { OwnListingProps } from "./Types";

const OwnListing: FC<OwnListingProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Typography color="text.secondary" textAlign="center" py={4}>
        No listings found
      </Typography>
    );
  }

  return (
    <Grid container spacing={5} justifyContent="center">
      {data.map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} xxl={2} key={item.id}>
          <Listing
            id={item.id}
            slug={item.slug}
            image={item.images[0] || ""}
            title={item.title}
            description={item.description}
            price={item.price}
            address={item.address}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default OwnListing;

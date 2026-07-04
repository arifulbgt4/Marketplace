"use client";
import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import Listing from "../Listing";

import { UserListingsProps } from "./Types";

const UserListings: FC<UserListingsProps> = ({ listings }) => {
  if (!listings || listings.length === 0) {
    return (
      <Grid container spacing={5} display="flex" justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h2" textAlign="center">
            Listings
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography color="text.secondary" textAlign="center">
            No listings found
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={5} display="flex" justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h2" textAlign="center">
          Listings
        </Typography>
      </Grid>
      <Grid item container xs={12} md={8} spacing={5} justifyContent="center">
        {listings.map((data) => (
          <Grid item xs={12} sm={6} key={data.id}>
            <Listing
              id={data.id}
              slug={data.slug}
              image={data.images[0] || ""}
              title={data.title}
              description={data.description}
              rating={data._count?.reviews ? 4.5 : undefined}
              address={data.address}
              price={data.price}
              bedrooms={data.bedrooms ?? undefined}
              bathrooms={data.bathrooms ?? undefined}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default UserListings;

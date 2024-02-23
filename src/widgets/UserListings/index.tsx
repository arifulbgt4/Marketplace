import { FC } from "react";
import { Grid, Typography, Divider } from "@mui/material";

import { userListingData } from "src/global/staticData";
import Listing from "../Listing";

import { UserListingsProps } from "./Types";

const UserListings: FC<UserListingsProps> = () => {
  return (
    <Grid container spacing={5}>
      <Grid item xs={12} display="flex" gap={1}>
        <Typography variant="h5">Listings</Typography>
        <Divider />
      </Grid>
      <Grid item container xs={12} spacing={5} justifyContent="center">
        {userListingData.map((data) => {
          const {
            id,
            image,
            title,
            description,
            rating,
            slug,
            address,
            price,
            services,
          } = data;
          return (
            <Grid item xs={12} sm={6} lg={4} key={id}>
              <Listing
                id={id}
                slug={slug}
                image={image}
                title={title}
                description={description}
                rating={rating}
                address={address}
                services={services}
                price={price}
              />
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default UserListings;

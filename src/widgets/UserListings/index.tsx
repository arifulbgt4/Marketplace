import { FC } from "react";
import { Grid, Typography, Divider } from "@mui/material";

import { userListingData } from "src/global/staticData";
import Listing from "../Listing";

import { UserListingsProps } from "./Types";

const UserListings: FC<UserListingsProps> = () => {
  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12} display="flex" gap={1}>
        <Typography variant="h5">Listings</Typography>
        <Divider />
      </Grid>
      <Grid item container xs={12} spacing={3}>
        {userListingData.map((data) => {
          const {
            id,
            image,
            title,
            price,
            description,
            rating,
            slug,
            address,
          } = data;
          return (
            <Grid item xs={12} md={6} key={id}>
              <Listing
                id={id}
                slug={slug}
                image={image}
                title={title}
                price={price}
                description={description}
                rating={rating}
                address={address}
              />
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default UserListings;

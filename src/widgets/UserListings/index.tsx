import { FC } from "react";
import { Grid } from "@mui/material";

import { userListingData } from "src/global/staticData";
import Listing from "../Listing";

import { UserListingsProps } from "./Types";

const UserListings: FC<UserListingsProps> = () => {
  return (
    <Grid container spacing={5}>
      {userListingData.map((data) => {
        const { id, image, title, price, description, rating, slug, address } =
          data;
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
  );
};

export default UserListings;

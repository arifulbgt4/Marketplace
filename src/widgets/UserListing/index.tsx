import { FC } from "react";
import { Grid, Paper } from "@mui/material";

import Listing from "src/widgets/Listing";
import { featurePostData } from "src/global/staticData";

import { UserListingProps } from "./Types";

const UserListing: FC<UserListingProps> = () => {
  return (
    <Paper>
      <Grid container spacing={5}>
        {featurePostData.map((data) => {
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
    </Paper>
  );
};

export default UserListing;

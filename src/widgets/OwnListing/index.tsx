import { FC } from "react";
import { Grid } from "@mui/material";

import Listing from "src/widgets/Listing";

import { OwnListingProps } from "./Types";

const OwnListing: FC<OwnListingProps> = ({ data }) => {
  return (
    <Grid container spacing={4}>
      {data.map((data) => {
        const { id, image, title, description, rating, slug, address } = data;
        return (
          <Grid item xs={12} sm={6} md={4} key={id}>
            <Listing
              id={id}
              slug={slug}
              image={image}
              title={title}
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

export default OwnListing;

import { FC } from "react";
import { Grid, Typography, Divider } from "@mui/material";

import Listing from "src/widgets/Listing";
import { ownListingData } from "src/global/staticData";

import { OwnerListingsProps } from "./Types";

const OwnerListings: FC<OwnerListingsProps> = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} display="flex" gap={1}>
        <Typography variant="h5">Acttivity</Typography>
        <Divider />
      </Grid>
      <Grid item xs={12} container spacing={3}>
        {ownListingData.slice(2).map((data) => {
          const { id, image, title, description, rating, slug, address } = data;
          return (
            <Grid item xs={12} md={6} key={id}>
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
    </Grid>
  );
};

export default OwnerListings;

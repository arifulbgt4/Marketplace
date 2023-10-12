import { FC } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";

import Listing from "src/widgets/Listing";
import { featurePostData } from "src/global/staticData";

import { ListingsProps } from "./Types";

const Listings: FC<ListingsProps> = () => {
  return (
    <Box>
      <Typography variant="h4">WE Found 91 Results</Typography>
      <Paper>
        <Grid container>
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
              <Grid item xs={12} md={6} lg={4} key={id}>
                <Listing
                  id={id}
                  slug={slug}
                  image={image}
                  address={address}
                  title={title}
                  price={price}
                  description={description}
                  rating={rating}
                />
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Listings;

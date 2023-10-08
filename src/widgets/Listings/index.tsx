import { FC } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";

import Listing from "src/widgets/Listing";
import { listings } from "src/global/staticData";

import { ListingsProps } from "./Types";

const Listings: FC<ListingsProps> = () => {
  return (
    <Box>
      <Typography variant="h4">WE Found 91 Results</Typography>
      <Paper>
        <Grid container>
          {listings.map((data) => {
            const { id, image, title, price, description, rating, slug } = data;
            return (
              <Grid item xs={4} key={id}>
                <Listing
                  id={id}
                  slug={slug}
                  image={image}
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

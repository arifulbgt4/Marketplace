import { FC } from "react";
import { Grid, Box, Stack } from "@mui/material";

import { listings } from "src/global/staticData";
import Listing from "../Listing";
import ListingPagination from "../ListingPagination";

import { SearchListingGroupProps } from "./Types";

const SearchListingGroup: FC<SearchListingGroupProps> = () => {
  return (
    <Box py={5}>
      <Grid container rowSpacing={5}>
        <Grid item container xs={12} columnSpacing={4} rowSpacing={4}>
          {listings.map((data) => {
            const { id, image, title, price, description, rating, slug } = data;
            return (
              <Grid item xs={12} md={6} lg={4} key={id}>
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
        <Grid item xs={12}>
          <Stack justifyContent="center" alignItems="center">
            <ListingPagination />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchListingGroup;

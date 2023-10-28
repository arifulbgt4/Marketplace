import { FC } from "react";
import { Grid, Box, Stack } from "@mui/material";

import { searchListingData } from "src/global/staticData";
import Listing from "../Listing";
import ListingPagination from "../ListingPagination";
import SearchFilterForm from "src/forms/SearchFilterForm";
import FitlerButtonGroup from "src/widgets/FilterButtonGroup";

import { SearchListingGroupProps } from "./Types";

const SearchListingGroup: FC<SearchListingGroupProps> = () => {
  return (
    <Box py={5}>
      <Grid container rowSpacing={5}>
        <Grid
          container
          item
          xs={12}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} lg={6}>
            <SearchFilterForm />
          </Grid>
          <Grid item xs={12} lg={3}>
            <FitlerButtonGroup />
          </Grid>
        </Grid>
        <Grid item container xs={12} columnSpacing={4} rowSpacing={4}>
          {searchListingData.map((data) => {
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

"use client";
import { FC, useState } from "react";
import { Grid, Box, Stack } from "@mui/material";

import { searchListingData } from "src/global/staticData";
import SearchFilterForm from "src/forms/SearchFilterForm";
import ListGridView from "src/widgets/ListGridView";
import Listing from "../Listing";
import ListingPagination from "../ListingPagination";

import { SearchListingGroupProps } from "./Types";

const SearchListingGroup: FC<SearchListingGroupProps> = () => {
  const [isGrid, setIsGrid] = useState(true);

  const handleGrid = (event: boolean) => {
    setIsGrid(event);
  };

  const handleList = (event: boolean) => {
    setIsGrid(event);
  };

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
            <ListGridView
              isGrid={isGrid}
              handleGrid={handleGrid}
              handleList={handleList}
            />
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
              <Grid item xs={12} md={isGrid && 6} lg={isGrid && 4} key={id}>
                <Listing
                  id={id}
                  isGrid={isGrid}
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

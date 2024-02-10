"use client";
import { FC, Suspense, useState } from "react";
import { Grid, Box, Stack, Hidden, IconButton, Drawer } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import { searchListingData } from "src/global/staticData";
import SearchFilterForm from "src/forms/SearchFilterForm";
import ListGridView from "src/widgets/ListGridView";
import ListSearchFiltersForm from "src/forms/ListSearchFiltersForm";
import Listing from "../Listing";
import ListingPagination from "../ListingPagination";

import { SearchListingGroupProps } from "./Types";

const SearchListingGroup: FC<SearchListingGroupProps> = () => {
  const [open, setOpen] = useState(false);
  const [isGrid, setIsGrid] = useState(true);

  const toggleGridList = () => {
    setIsGrid(!isGrid);
  };
  const onSubmitForm = async () => {};

  return (
    <Box py={{ xs: 1, md: 5 }}>
      <Grid container rowSpacing={5}>
        <Grid
          container
          item
          xs={12}
          justifyContent="space-between"
          alignItems="center"
        >
          <Hidden mdUp>
            <Grid item xs={12} display="flex">
              <Box>
                <IconButton sx={{ border: 1 }} onClick={() => setOpen(true)}>
                  <FilterAltIcon />
                </IconButton>
              </Box>
              <Drawer open={open} onClose={() => setOpen(false)} anchor="left">
                <Box width={{ xs: 250, sm: 300 }}>
                  <ListSearchFiltersForm
                    onCloseMobileDrawer={() => setOpen(false)}
                  />
                </Box>
              </Drawer>
            </Grid>
          </Hidden>
        </Grid>
        <Grid item container xs={12} columnSpacing={4} rowSpacing={4}>
          {searchListingData.map((data) => {
            const {
              id,
              image,
              title,
              price,
              description,
              services,
              rating,
              slug,
              address,
            } = data;
            return (
              <Grid item xs={12} sm={isGrid && 6} lg={isGrid && 4} key={id}>
                <Listing
                  id={id}
                  isGrid={isGrid}
                  slug={slug}
                  image={image}
                  title={title}
                  price={price}
                  services={services}
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

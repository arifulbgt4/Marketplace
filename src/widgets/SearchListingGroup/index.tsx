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
          <Hidden mdUp implementation="css">
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
        <Grid item container xs={12} spacing={5}>
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
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2.5} key={id}>
                <Listing
                  id={id}
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

"use client";
import { FC, Suspense, useState, useEffect } from "react";
import { Grid, Box, Stack, Hidden, IconButton, Drawer, Skeleton } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import { getSearchListings } from "src/server/listing";
import SearchFilterForm from "src/forms/SearchFilterForm";
import ListGridView from "src/widgets/ListGridView";
import ListSearchFiltersForm from "src/forms/ListSearchFiltersForm";
import Listing from "../Listing";
import ListingPagination from "../ListingPagination";

import { SearchListingGroupProps } from "./Types";

const SearchListingGroup: FC<SearchListingGroupProps> = () => {
  const [open, setOpen] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getSearchListings({});
        setListings(data.listings);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

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
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.5} key={index}>
                  <Skeleton variant="rounded" height={300} />
                </Grid>
              ))
            : listings.map((data) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.5} key={data.id}>
                  <Listing
                    id={data.id}
                    slug={data.slug}
                    image={data.images[0] || ""}
                    title={data.title}
                    price={data.price}
                    description={data.description}
                    rating={data._count.reviews > 0 ? 4.5 : undefined}
                    address={data.address}
                    type={data.type}
                    bedrooms={data.bedrooms}
                    bathrooms={data.bathrooms}
                  />
                </Grid>
              ))}
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

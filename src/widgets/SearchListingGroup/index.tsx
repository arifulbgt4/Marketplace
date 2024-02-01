"use client";
import { FC, Suspense, useState } from "react";
import {
  Grid,
  Box,
  Stack,
  Hidden,
  IconButton,
  Drawer,
  Typography,
  Paper,
  Modal,
  ButtonBase,
  Button,
  InputAdornment,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import CloseIcon from "@mui/icons-material/Close";

import { searchListingData } from "src/global/staticData";
import SearchFilterForm from "src/forms/SearchFilterForm";
import ListGridView from "src/widgets/ListGridView";
import { TextField } from "src/components/Input";
import ListSearchFiltersForm from "src/forms/ListSearchFiltersForm";
import Listing from "../Listing";
import ListingPagination from "../ListingPagination";

import { SearchListingGroupProps } from "./Types";

const SearchListingGroup: FC<SearchListingGroupProps> = () => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isGrid, setIsGrid] = useState(true);

  const toggleGridList = () => {
    setIsGrid(!isGrid);
  };
  const onSubmitForm = async () => {};

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
          <Hidden mdUp>
            <Grid item xs={12} display="flex">
              <IconButton
                onClick={() => setOpen(true)}
                sx={(theme) => ({
                  border: `1px solid ${theme.palette.grey[700]}`,
                  px: 2,
                })}
              >
                <FilterAltIcon />
              </IconButton>
              <Drawer open={open} onClose={() => setOpen(false)} anchor="left">
                <Box width={{ xs: 250, sm: 300 }}>
                  <ListSearchFiltersForm
                    onCloseMobileDrawer={() => setOpen(false)}
                  />
                </Box>
              </Drawer>
              <Paper sx={{ width: "100%" }}>
                <Stack
                  component={ButtonBase}
                  sx={(theme) => ({
                    border: `1px solid ${theme.palette.grey[700]}`,
                  })}
                  width="100%"
                  flexDirection="row"
                  justifyContent="flex-start"
                  borderRadius={12.5}
                  py={0.5}
                  ml={1.3}
                  onClick={() => {
                    setOpenModal(true);
                  }}
                >
                  <IconButton sx={{ px: 2.5 }}>
                    <SearchSharpIcon />
                  </IconButton>
                  <Stack>
                    <Typography>Search section</Typography>
                    <Typography
                      color="text.secondary"
                      variant="subtitle2"
                      textAlign="start"
                    >
                      Location
                    </Typography>
                  </Stack>
                </Stack>
                <Modal
                  open={openModal}
                  onClose={() => {
                    setOpenModal(false);
                  }}
                  slotProps={{
                    backdrop: {
                      sx: {
                        backgroundColor: "transparent",
                      },
                    },
                  }}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  sx={{ bgcolor: "transparent", top: 48 }}
                >
                  <Stack
                    component={Paper}
                    gap={1}
                    px={2.8}
                    pt={2}
                    pb={6}
                    position="relative"
                    sx={{
                      borderBottomRightRadius: 18,
                      borderBottomLeftRadius: 18,
                    }}
                  >
                    <Typography variant="h5">Where to ?</Typography>
                    <Suspense>
                      <SearchFilterForm
                        size="small"
                        onClose={() => {
                          setOpenModal(false);
                        }}
                      />
                     </Suspense>
                    <Box position="absolute" bottom={10} left="45%">
                      <IconButton
                        size="small"
                        sx={(theme) => ({
                          bgcolor: theme.palette.action.disabled,
                        })}
                        onClick={() => {
                          setOpenModal(false);
                        }}
                      >
                        <CloseIcon
                          sx={{ height: 18, width: 18 }}
                          fontSize="small"
                        />
                      </IconButton>
                    </Box>
                  </Stack>
                </Modal>
              </Paper>
            </Grid>
          </Hidden>
          <Hidden mdDown>
            <Grid item md={6}>
              <Suspense>
                <SearchFilterForm size="small" />
              </Suspense>
            </Grid>
          </Hidden>
          <Hidden mdDown>
            <Grid item md={3}>
              <ListGridView isGrid={isGrid} toggleGridList={toggleGridList} />
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

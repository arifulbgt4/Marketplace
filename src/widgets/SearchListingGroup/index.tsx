"use client";
import { FC, useState } from "react";
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
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import CloseIcon from "@mui/icons-material/Close";

import { searchListingData } from "src/global/staticData";
import SearchFilterForm from "src/forms/SearchFilterForm";
import ListGridView from "src/widgets/ListGridView";
import Listing from "../Listing";
import ListingPagination from "../ListingPagination";
import ListSearchFilters from "../ListSearchFilters";

import { SearchListingGroupProps } from "./Types";

const SearchListingGroup: FC<SearchListingGroupProps> = () => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isGrid, setIsGrid] = useState(true);

  const toggleGridList = () => {
    setIsGrid(!isGrid);
  };

  return (
    <Box py={5}>
      <Grid container rowSpacing={5}>
        <Grid
          container
          item
          xs={12}
          justifyContent={{ xs: "space-between" }}
          alignItems="center"
        >
          <Hidden mdUp>
            <Grid item xs={12} display="flex">
              <IconButton
                onClick={() => setOpen(true)}
                sx={{
                  border: "1px solid #fff",
                  px: 2.2,
                }}
              >
                <FilterAltIcon />
              </IconButton>

              <Drawer open={open} onClose={() => setOpen(false)}>
                <Box width={{ xs: 250, sm: 300 }}>
                  <ListSearchFilters
                    onCloseMobileDrawer={() => setOpen(false)}
                  />
                </Box>
              </Drawer>
              <Paper sx={{ width: "100%" }}>
                <Stack
                  component={ButtonBase}
                  width="100%"
                  flexDirection="row"
                  justifyContent="flex-start"
                  border="1px solid #fff"
                  borderRadius={12.5}
                  py={0.5}
                  ml={{ xs: 1.3 }}
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
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Stack
                    gap={1}
                    sx={{
                      position: "absolute" as "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "100vw",
                      height: "100%",
                      bgcolor: "background.paper",

                      boxShadow: 24,
                      p: 2,
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        setOpenModal(false);
                      }}
                      sx={{ justifyContent: "flex-start" }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography variant="h5">Where to ?</Typography>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-adornment-location">
                        Location
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-location"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton>
                              <LocationOnSharpIcon />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-adornment-listing">
                        Key
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        endAdornment={
                          <InputAdornment position="start">
                            <IconButton>
                              <SearchSharpIcon />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <Button fullWidth variant="contained" sx={{ py: 2 }}>
                      Search
                    </Button>
                  </Stack>
                </Modal>
              </Paper>
            </Grid>
          </Hidden>
          <Hidden mdDown>
            <Grid item md={6}>
              <SearchFilterForm />
            </Grid>
          </Hidden>
          <Hidden mdDown>
            <Grid md={3}>
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

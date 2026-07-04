"use client";
import { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  Button,
  Box,
  Hidden,
  ButtonGroup,
  Skeleton,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";

import OwnListing from "src/widgets/OwnListing";
import { getUserListings } from "src/server/user";

const ListingPage = () => {
  const [value, setValue] = useState("1");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getUserListings();
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = listings.filter((listing) => {
    if (value === "1") return listing.status === "published";
    if (value === "2") return listing.status === "archived";
    return listing.status === "draft";
  });

  return (
    <Box>
      <Stack
        flexDirection={{ xs: "row" }}
        justifyContent={{ xs: "space-around", md: "space-between" }}
        gap={{ xs: 1, md: 0 }}
        alignItems="center"
        pb={{ xs: 4 }}
      >
        <Hidden mdUp>
          <ListAltIcon color="primary" />
        </Hidden>
        <Hidden mdDown>
          <Typography variant="h3">My Listings</Typography>
        </Hidden>
        <ButtonGroup>
          <Button
            disableRipple
            size="small"
            sx={{ px: 1.25, py: 1 }}
            onClick={() => setValue("1")}
            variant={value === "1" ? "contained" : "text"}
          >
            published
          </Button>
          <Button
            disableRipple
            size="small"
            sx={{ px: 1.25, py: 1 }}
            onClick={() => setValue("2")}
            variant={value === "2" ? "contained" : "text"}
          >
            unpublished
          </Button>
          <Button
            disableRipple
            size="small"
            sx={{ px: 1.25, py: 1 }}
            onClick={() => setValue("3")}
            variant={value === "3" ? "contained" : "text"}
          >
            draft
          </Button>
        </ButtonGroup>
      </Stack>
      <Box>
        {loading ? (
          <Stack spacing={2}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" height={100} />
            ))}
          </Stack>
        ) : (
          <OwnListing data={filteredListings} />
        )}
      </Box>
    </Box>
  );
};

export default ListingPage;

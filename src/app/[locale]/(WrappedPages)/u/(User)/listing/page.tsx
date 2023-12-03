"use client";
import { useState } from "react";
import { Stack, Typography, Button, Box, Hidden } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";

import OwnListing from "src/widgets/OwnListing";
import {
  ownListingPublishData,
  ownListingUnpublishData,
  ownListingDraftData,
} from "src/global/staticData";

const ListingPage = () => {
  const [value, setValue] = useState("1");

  return (
    <Box>
      <Stack
        flexDirection={{ xs: "row" }}
        justifyContent={{ xs: "space-around", md: "space-between" }}
        gap={{ xs: 1, md: 0 }}
        alignItems="center"
      >
        <Hidden mdUp>
          <ListAltIcon color="primary" />
        </Hidden>
        <Hidden mdDown>
          <Typography variant="h3">My LIstings</Typography>
        </Hidden>
        <Stack flexDirection="row" width={240}>
          <Button
            disableRipple
            size="small"
            onClick={() => setValue("1")}
            variant={value === "1" ? "contained" : "text"}
          >
            published
          </Button>
          <Button
            disableRipple
            size="small"
            onClick={() => setValue("2")}
            variant={value === "2" ? "contained" : "text"}
          >
            unpublished
          </Button>
          <Button
            disableRipple
            size="small"
            onClick={() => setValue("3")}
            variant={value === "3" ? "contained" : "text"}
          >
            draft
          </Button>
        </Stack>
      </Stack>
      <Box pt={{ xs: 2, md: 5 }}>
        {value === "1" ? (
          <OwnListing data={ownListingPublishData} />
        ) : value === "2" ? (
          <OwnListing data={ownListingUnpublishData} />
        ) : (
          <OwnListing data={ownListingDraftData} />
        )}
      </Box>
    </Box>
  );
};

export default ListingPage;

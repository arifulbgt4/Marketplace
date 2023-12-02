"use client";
import { useState } from "react";
import { Stack, Typography, ButtonGroup, Button, Box } from "@mui/material";

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
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h3">My LIstings</Typography>
        <ButtonGroup>
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
        </ButtonGroup>
      </Stack>
      <Box pt={5}>
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

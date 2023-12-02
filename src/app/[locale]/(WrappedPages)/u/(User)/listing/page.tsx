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
  const [value, setValue] = useState(ownListingPublishData);

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
            onClick={() => setValue(ownListingPublishData)}
            variant={value === ownListingPublishData ? "contained" : "text"}
          >
            published
          </Button>
          <Button
            disableRipple
            size="small"
            onClick={() => setValue(ownListingUnpublishData)}
            variant={value === ownListingUnpublishData ? "contained" : "text"}
          >
            unpublished
          </Button>
          <Button
            disableRipple
            size="small"
            onClick={() => setValue(ownListingDraftData)}
            variant={value === ownListingDraftData ? "contained" : "text"}
          >
            draft
          </Button>
        </ButtonGroup>
      </Stack>
      <Box pt={5}>
        <OwnListing data={value} />
      </Box>
    </Box>
    // <TabContext value={value}>
    //   <Stack
    //     flexDirection="row"
    //     justifyContent="space-between"
    //     alignItems="center"
    //   >
    //     <Typography variant="h3">My LIstings</Typography>
    //     <TabList onChange={handleChange}>
    //       <Tab
    //         sx={(theme) => ({
    //           bgcolor: value === "1" ? theme.palette.primary.main : "inherit",

    //           borderRadius: 2,
    //         })}
    //         color="#fff"
    //         label="Published"
    //         value="1"
    //       />
    //       <Tab label="Unpublished" value="2" />
    //       <Tab label="Draft" value="3" />
    //     </TabList>
    //   </Stack>
    //   <TabPanel sx={{ px: 0 }} value="1">
    //     <OwnListing data={ownListingPublishData} />
    //   </TabPanel>
    //   <TabPanel sx={{ px: 0 }} value="2">
    //     <OwnListing data={ownListingUnpublishData} />
    //   </TabPanel>
    //   <TabPanel sx={{ px: 0 }} value="3">
    //     <OwnListing data={ownListingDraftData} />
    //   </TabPanel>
    // </TabContext>
  );
};

export default ListingPage;

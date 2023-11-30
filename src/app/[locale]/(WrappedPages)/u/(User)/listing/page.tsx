"use client";
import { useState } from "react";
import { Stack, Typography, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import OwnListing from "src/widgets/OwnListing";
import {
  ownListingPublishData,
  ownListingUnpublishData,
  ownListingDraftData,
} from "src/global/staticData";

const ListingPage = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h3">My LIstings</Typography>
        <TabList onChange={handleChange}>
          <Tab label="Published" value="1" />
          <Tab label="Unpublished" value="2" />
          <Tab label="Draft" value="3" />
        </TabList>
      </Stack>
      <TabPanel sx={{ px: 0 }} value="1">
        <OwnListing data={ownListingPublishData} />
      </TabPanel>
      <TabPanel sx={{ px: 0 }} value="2">
        <OwnListing data={ownListingUnpublishData} />
      </TabPanel>
      <TabPanel sx={{ px: 0 }} value="3">
        <OwnListing data={ownListingDraftData} />
      </TabPanel>
    </TabContext>
  );
};

export default ListingPage;

"use client";
import { FC, useState } from "react";
import { Grid, Stack, Box, Avatar } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { UserLayoutProps } from "./Types";

const UserLayout: FC<UserLayoutProps> = ({ children }) => {
  const [value, setValue] = useState("two");
  return (
    <Grid container>
      <Grid item xs={12}>
        <Stack>
          <Box>
            <Avatar>pp</Avatar>
          </Box>
          <Tabs
            onChange={(a, b) => {
              setValue(b);
            }}
            value={value}
          >
            <Tab label="DASHBOARD" value="one" />
            <Tab label="PROFILE" value="two" />
            <Tab label="LISTINGS" value="three" />
            <Tab label="BOOKMARKS" value="four" />
            <Tab label="SSETTINGS" value="five" />
          </Tabs>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        {children}
      </Grid>
    </Grid>
  );
};

export default UserLayout;

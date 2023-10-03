"use client";
import { FC } from "react";
import { Grid, Stack, Box, Avatar, Typography, Link } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { usePathname } from "next/navigation";

import { UserLayoutProps } from "./Types";

const UserLayout: FC<UserLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Stack
          direction="column"
          justifyContent="space-between"
          alignSelf="stretch"
        >
          <Box>
            <Stack direction="row" alignItems="center">
              <Avatar>pp</Avatar>
              <Typography variant="h4">User Name</Typography>
            </Stack>
            <Typography variant="subtitle1">
              member science, september,2023
            </Typography>
          </Box>
          <Tabs value={pathname}>
            <Tab
              component={Link}
              href="/dashboard"
              label="DASHBOARD"
              value="/dashboard"
            />
            <Tab
              component={Link}
              href="/profile"
              label="PROFILE"
              value="/profile"
            />
            <Tab
              component={Link}
              href="/listing"
              label="LISTINGS"
              value="/listing"
            />
            <Tab
              component={Link}
              href="/bookmarks"
              label="BOOKMARKS"
              value="/bookmarks"
            />
            <Tab
              component={Link}
              href="/settings"
              label="SSETTINGS"
              value="/settings"
            />
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

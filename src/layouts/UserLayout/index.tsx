"use client";
import { FC } from "react";
import {
  Grid,
  Stack,
  Box,
  Avatar,
  Typography,
  Link,
  Container,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { usePathname } from "next/navigation";

import routes from "src/global/routes";

import { UserLayoutProps } from "./Types";

const UserLayout: FC<UserLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <>
      <Container>
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
                  href={routes.userDashboard}
                  label="DASHBOARD"
                  value="/dashboard"
                />
                <Tab
                  component={Link}
                  href={routes.userProfile}
                  label="PROFILE"
                  value="/profile"
                />
                <Tab
                  component={Link}
                  href={routes.userListing}
                  label="LISTINGS"
                  value="/listing"
                />
                <Tab
                  component={Link}
                  href={routes.userBookmark}
                  label="BOOKMARKS"
                  value="/bookmarks"
                />
                <Tab
                  component={Link}
                  href={routes.userSetting}
                  label="SSETTINGS"
                  value="/settings"
                />
              </Tabs>
            </Stack>
          </Grid>
        </Grid>
      </Container>
      {children}
    </>
  );
};

export default UserLayout;

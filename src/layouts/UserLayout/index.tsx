"use client";
import { FC } from "react";
import {
  Grid,
  Stack,
  Button,
  Avatar,
  Typography,
  Link,
  Container,
  Box,
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
              pt={10}
              gap={10}
              direction="column"
              justifyContent="space-between"
              alignSelf="stretch"
            >
              <Stack>
                <Stack flexDirection="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Avatar>pp</Avatar>
                    <Typography variant="h4">User Name</Typography>
                  </Stack>
                  <Button variant="outlined">create Listing +</Button>
                </Stack>
                <Typography variant="subtitle1">
                  member science, september,2023
                </Typography>
              </Stack>
              <Tabs
                value={
                  pathname.includes(routes.userSetting)
                    ? routes.userSetting
                    : pathname
                }
              >
                <Tab
                  component={Link}
                  href={routes.userDashboard}
                  label="DASHBOARD"
                  value={routes.userDashboard}
                />
                <Tab
                  component={Link}
                  href={routes.userAccount}
                  label="ACCOUNT"
                  value={routes.userAccount}
                />
                <Tab
                  component={Link}
                  href={routes.userListing}
                  label="LISTINGS"
                  value={routes.userListing}
                />
                <Tab
                  component={Link}
                  href={routes.userBookmark}
                  label="BOOKMARKS"
                  value={routes.userBookmark}
                />
                <Tab
                  component={Link}
                  href={routes.userSetting}
                  label="SSETTING"
                  value={routes.userSetting}
                />
              </Tabs>
            </Stack>
          </Grid>
        </Grid>
      </Container>
      <Box pt={10}>{children}</Box>
    </>
  );
};

export default UserLayout;

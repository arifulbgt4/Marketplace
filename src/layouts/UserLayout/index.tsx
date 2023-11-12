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
    <Box pt={10}>
      <Container>
        <Grid container>
          <Grid item xs={12}>
            <Stack
              gap={10}
              direction="column"
              justifyContent="space-between"
              alignSelf="stretch"
            >
              <Stack
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Avatar>pp</Avatar>
                    <Typography variant="h4">User Name</Typography>
                  </Stack>
                  <Typography variant="subtitle1">
                    member science, september,2023
                  </Typography>
                </Stack>

                <Box>
                  <Button
                    component={Link}
                    href={`${routes.ListingCreatePage}`}
                    variant="outlined"
                    size="large"
                  >
                    create Listing +
                  </Button>
                </Box>
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
                  label="SETTINGS"
                  value={routes.userSetting}
                />
              </Tabs>
            </Stack>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Box pt={5}>{children}</Box>
      </Container>
    </Box>
  );
};

export default UserLayout;

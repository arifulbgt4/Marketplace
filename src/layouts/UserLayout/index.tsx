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
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { usePathname } from "next/navigation";

import routes from "src/global/routes";

import { UserLayoutProps } from "./Types";

const UserLayout: FC<UserLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <Box pt={{ xs: 3, md: 8 }}>
      <Container>
        <Grid container>
          <Grid item xs={12}>
            <Stack
              gap={{ xs: 3, md: 8 }}
              direction="column"
              justifyContent="space-between"
              alignSelf="stretch"
            >
              <Stack
                flexDirection={{ md: "row" }}
                justifyContent="space-between"
                gap={{ xs: 2, md: 0 }}
              >
                <Stack gap={0.5}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Avatar />
                    <Typography variant="h4">User Name</Typography>
                  </Stack>
                  <Typography variant="subtitle1">
                    member science, september,2023
                  </Typography>
                </Stack>
                <Box width={{ xs: "100%", md: "auto" }}>
                  <Button
                    component={Link}
                    href={`${routes.ListingCreatePage}`}
                    variant="outlined"
                    size="large"
                    fullWidth
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
                  wrapped
                  component={Link}
                  href={routes.userDashboard}
                  icon={<DashboardIcon fontSize="small" />}
                  iconPosition="start"
                  label="DASHBOARD"
                  value={routes.userDashboard}
                />
                <Tab
                  component={Link}
                  href={routes.userAccount}
                  icon={<ManageAccountsIcon fontSize="small" />}
                  iconPosition="start"
                  label="ACCOUNT"
                  value={routes.userAccount}
                />
                <Tab
                  component={Link}
                  href={routes.userListing}
                  icon={<ListAltIcon fontSize="small" />}
                  iconPosition="start"
                  label="LISTINGS"
                  value={routes.userListing}
                />
                <Tab
                  component={Link}
                  href={routes.userBookmark}
                  icon={<BookmarksIcon fontSize="small" />}
                  iconPosition="start"
                  label="BOOKMARKS"
                  value={routes.userBookmark}
                />
                <Tab
                  component={Link}
                  href={routes.userSetting}
                  icon={<SettingsIcon fontSize="small" />}
                  iconPosition="start"
                  label="SETTINGS"
                  value={routes.userSetting}
                />
              </Tabs>
            </Stack>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Box pt={{ xs: 3, md: 5 }}>{children}</Box>
      </Container>
    </Box>
  );
};

export default UserLayout;

"use client";
import { FC } from "react";
import { usePathname } from "next/navigation";
import { Stack, Link, Container, Box, Paper } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import routes from "src/global/routes";

import { UserLayoutProps } from "./Types";

const UserLayout: FC<UserLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <Box>
      <Box py={2} component={Paper} elevation={0}>
        <Container>
          <Stack
            gap={{ xs: 3, md: 8 }}
            direction="column"
            justifyContent="space-between"
            alignSelf="stretch"
          >
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
                href={routes.userOrder}
                icon={<ShoppingCartIcon fontSize="small" />}
                iconPosition="start"
                label="ORDER"
                value={routes.userOrder}
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
        </Container>
      </Box>
      <Container>
        <Box pt={{ xs: 3, md: 5 }}>{children}</Box>
      </Container>
    </Box>
  );
};

export default UserLayout;

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
      <Box component={Paper} elevation={0}>
        <Container>
          <Tabs
            value={
              pathname.includes(routes.userSetting)
                ? routes.userSetting
                : pathname
            }
            variant="scrollable"
            allowScrollButtonsMobile
          >
            <Tab
              component={Link}
              href={routes.userDashboard}
              icon={<DashboardIcon fontSize="small" />}
              iconPosition="start"
              label="DASHBOARD"
              value={routes.userDashboard}
              sx={{ py: { xs: 2, md: 4 }, pl: 0 }}
            />
            <Tab
              component={Link}
              href={routes.userAccount}
              icon={<ManageAccountsIcon fontSize="small" />}
              iconPosition="start"
              label="ACCOUNT"
              value={routes.userAccount}
              sx={{ py: { xs: 2, md: 4 } }}
            />
            <Tab
              component={Link}
              href={routes.userListing}
              icon={<ListAltIcon fontSize="small" />}
              iconPosition="start"
              label="LISTINGS"
              value={routes.userListing}
              sx={{ py: { xs: 2, md: 4 } }}
            />
            <Tab
              component={Link}
              href={routes.userBookmark}
              icon={<BookmarksIcon fontSize="small" />}
              iconPosition="start"
              label="BOOKMARKS"
              value={routes.userBookmark}
              sx={{ py: { xs: 2, md: 4 } }}
            />
            <Tab
              component={Link}
              href={routes.userOrder}
              icon={<ShoppingCartIcon fontSize="small" />}
              iconPosition="start"
              label="ORDER"
              value={routes.userOrder}
              sx={{ py: { xs: 2, md: 4 } }}
            />
            <Tab
              component={Link}
              href={routes.userSetting}
              icon={<SettingsIcon fontSize="small" />}
              iconPosition="start"
              label="SETTINGS"
              value={routes.userSetting}
              sx={{ py: { xs: 2, md: 4 } }}
            />
          </Tabs>
        </Container>
      </Box>
      <Container>
        <Box pt={{ xs: 3, md: 5 }}>{children}</Box>
      </Container>
    </Box>
  );
};

export default UserLayout;

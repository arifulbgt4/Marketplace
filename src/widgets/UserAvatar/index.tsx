import { useState, FC } from "react";
import { signOut } from "next-auth/react";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";

import routes from "src/global/routes";

import { UserAvatarProps } from "./Types";

const UserAvatar: FC<UserAvatarProps> = ({ userimg }) => {
  const [anchorElAvat, setAnchorElAvat] = useState<HTMLElement | null>(null);

  const handleOpenNavAvatar = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAvat(event.currentTarget);
  };

  const handleCloseNavAvatar = () => {
    setAnchorElAvat(null);
  };

  return (
    <>
      <IconButton
        onClick={handleOpenNavAvatar}
        sx={(theme) => ({
          p: 0,
          border: 2,
          padding: !userimg ? 0.4 : 0,
          borderColor: theme.palette.action.focus,
        })}
      >
        <Avatar
          sx={{ height: userimg ? 32 : 24, width: userimg ? 32 : 24 }}
          src={userimg && userimg}
          alt="UN"
        >
          {!userimg && (
            <SvgIcon
              sx={(theme) => ({ bgcolor: theme.palette.background.paper })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                shape-rendering="geometricPrecision"
                text-rendering="geometricPrecision"
                image-rendering="optimizeQuality"
                fill-rule="evenodd"
                clip-rule="evenodd"
                viewBox="0 0 512 469.76"
              >
                <path
                  fill-rule="nonzero"
                  d="M139.64 191.28c3.34-9.28 8.44-12.29 15.16-12.1l-4.43-2.94c-2.4-30.05 4.64-82.18-27.99-92.05 61.74-76.3 132.9-117.79 186.33-49.92 64.37 3.38 90.19 105.67 38.85 148.73l-.3 2.54c2.01-.61 4.02-1 5.95-1.15 3.79-.29 7.42.33 10.51 1.97 3.39 1.81 5.98 4.74 7.31 8.89 1.28 3.97 1.33 9.04-.35 15.27l-8.03 22.78c-1.3 3.7-2.49 6.3-5.08 8.36-2.67 2.11-5.9 2.9-10.9 2.63-.83-.04-1.66-.13-2.47-.28a55.67 55.67 0 0 1-3.68 16.32c-2.77 7.12-6.63 12.93-10.43 18.29-4.3 6.05-8.85 11.53-13.6 16.45 3.7 12.99 8.47 22.56 14.19 29.84 29.04 20.88 107.25 25.79 134.48 40.97 39.31 22 38.23 64.52 46.84 103.88H0c8.53-39.01 7.65-82.23 46.84-103.88 34.52-19.22 107.77-17.99 136.96-42.9 4.2-6.58 7.75-14.46 10.47-23.86-6.23-6.48-12.07-14.18-17.39-23.12l-.36-.57c-4.8-8.06-10.6-17.79-12.42-31.3l-1.56.03c-3.27-.04-6.42-.79-9.37-2.46-4.74-2.7-8.06-7.3-10.3-12.49l-.2-.52c-2.52-6.09-3.67-13.03-3.94-18.28-.1-1.96-.1-5.85.01-9.57v-.05c.08-3.19.25-6.28.49-8.01.08-.53.21-1.03.41-1.5zm182.93 143.68-.63-.75c-6.23-7.49-11.48-16.95-15.64-29.28-6.79 5.55-14.48 10.26-22.75 13.76l-.43.19h-.01c-10.72 4.68-21.79 6.94-32.76 6.69-5.95-.13-11.86-1-17.67-2.61l-.22-.06c-9.51-2.53-18.96-7.09-28-14.06-3.72 10.72-8.55 19.6-14.2 26.93l33.92 82.84 19.93-45.96-9.73-10.63c-7.31-10.69-3.06-23.1 8.75-25.01 5.16-.83 26.04-.95 30.82.33 10.7 2.86 13.89 14.97 7.62 24.68l-9.73 10.63 19.76 45.96 30.97-83.65zm-117.38-42.19.4.34c15.35 14.68 32.36 20.2 48.51 19.57 19.48-.77 37.89-10.37 50.85-23.65.41-.42.88-.8 1.41-1.09 4.8-4.81 9.41-10.29 13.76-16.41 3.34-4.71 6.72-9.78 8.99-15.61 2.21-5.68 3.47-12.33 2.78-20.51-.08-1.32.23-2.68 1.01-3.86a6.112 6.112 0 0 1 8.46-1.75c1.07.7 2.16 1.28 3.25 1.68.94.34 1.85.55 2.68.59 1.75.09 2.54.09 2.65 0 .19-.14.58-1.19 1.16-2.84l7.79-22.06c.99-3.72 1.06-6.4.49-8.18-.29-.9-.8-1.51-1.42-1.84-.92-.49-2.27-.66-3.84-.54-3.42.26-7.42 1.92-10.97 4.61-1.3.98-2.99 1.45-4.72 1.15-3.33-.57-5.58-3.74-5.01-7.07 5.77-33.67 3.13-55.61-4.04-70.57-6.28-13.11-16.3-21.05-27.17-26.98-24.12 18.47-41.1 20.58-58.04 22.67-14.01 1.73-27.99 3.46-46.51 16.27-8.75 6.05-14.58 13.37-17.59 21.87-3.09 8.73-3.33 18.89-.83 30.4.32 1.16.29 2.43-.16 3.65-1.14 3.17-4.66 4.81-7.83 3.67l-5.61-2.03c-7.24-2.53-12.37-3.71-14.35.84-.16 1.47-.27 3.72-.33 6.04v.05c-.09 3.35-.09 6.85-.01 8.61.21 4.15 1.08 9.55 2.97 14.13l.22.45c1.27 2.97 2.96 5.49 5.06 6.68 1.06.6 2.24.88 3.48.89 1.52.02 3.21-.3 5.01-.83.57-.2 1.18-.31 1.82-.32a6.111 6.111 0 0 1 6.26 5.96c.33 14.1 6.38 24.24 11.25 32.41l.34.57c5.44 9.14 11.44 16.81 17.83 23.04z"
                />
              </svg>
            </SvgIcon>
          )}
        </Avatar>
      </IconButton>
      <Menu
        sx={(theme) => ({
          mt: { xs: -4.6, md: 7.9 },
          right: { xs: -16, md: 0 },
          left: { xs: -16, md: 2.5 },
          mb: { xs: 6, md: 0 },
          background: "transparent",
          backdropFilter: "blur(2px)",
          top: "0px !important",
          "& .MuiMenu-paper": {
            borderTopRightRadius: { xs: 24, md: 4 },
            borderTopLeftRadius: { xs: 24, md: 4 },
            boxShadow: { xs: 15, md: 4 },
            top: { md: "0px !important" },
          },
        })}
        id="menu-appbar"
        anchorEl={anchorElAvat}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElAvat)}
        onClose={handleCloseNavAvatar}
      >
        <Stack width={{ md: 310 }} justifyContent="center" alignItems="center">
          <Box
            borderRadius={3}
            p={1}
            mt={2}
            bgcolor="background.default"
            mx={2}
          >
            <Grid
              container
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={4}>
                <MenuItem
                  sx={{ justifyContent: "center", borderRadius: 1 }}
                  component={Link}
                  disableRipple
                  href={routes.userDashboard}
                  onClick={handleCloseNavAvatar}
                >
                  <Stack justifyContent="center" alignItems="center">
                    <IconButton
                      disableRipple
                      sx={{
                        "&.hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <DashboardIcon />
                    </IconButton>
                    <Typography variant="caption">Dashboard</Typography>
                  </Stack>
                </MenuItem>
              </Grid>
              <Grid item xs={4}>
                <MenuItem
                  sx={{ justifyContent: "center", borderRadius: 1 }}
                  component={Link}
                  disableRipple
                  href={routes.userAccount}
                  onClick={handleCloseNavAvatar}
                >
                  <Stack justifyContent="center" alignItems="center">
                    <IconButton
                      disableRipple
                      sx={(theme) => ({
                        "&.hover": {
                          bgcolor: "transparent",
                        },
                      })}
                    >
                      <ManageAccountsIcon />
                    </IconButton>
                    <Typography variant="caption">Account</Typography>
                  </Stack>
                </MenuItem>
              </Grid>
              <Grid item xs={4}>
                <MenuItem
                  sx={{ justifyContent: "center", borderRadius: 1 }}
                  component={Link}
                  disableRipple
                  href={`${routes.profile}/slug`}
                  onClick={handleCloseNavAvatar}
                >
                  <Stack justifyContent="center" alignItems="center">
                    <IconButton
                      disableRipple
                      sx={{
                        "&.hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <AccountCircleIcon />
                    </IconButton>
                    <Typography variant="caption">Profile</Typography>
                  </Stack>
                </MenuItem>
              </Grid>

              <Grid item xs={4}>
                <MenuItem
                  sx={{ justifyContent: "center", borderRadius: 1 }}
                  component={Link}
                  disableRipple
                  href={routes.userListing}
                  onClick={handleCloseNavAvatar}
                >
                  <Stack justifyContent="center" alignItems="center">
                    <IconButton
                      disableRipple
                      sx={{
                        "&.hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <ListAltIcon />
                    </IconButton>
                    <Typography variant="caption">Listing</Typography>
                  </Stack>
                </MenuItem>
              </Grid>
              <Grid item xs={4}>
                <MenuItem
                  sx={{ justifyContent: "center", borderRadius: 1 }}
                  component={Link}
                  disableRipple
                  href={routes.userBookmark}
                  onClick={handleCloseNavAvatar}
                >
                  <Stack justifyContent="center" alignItems="center">
                    <IconButton
                      disableRipple
                      sx={{
                        "&.hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <BookmarksIcon />
                    </IconButton>
                    <Typography variant="caption">Bookmark</Typography>
                  </Stack>
                </MenuItem>
              </Grid>

              <Grid item xs={4}>
                <MenuItem
                  sx={{ justifyContent: "center", borderRadius: 1 }}
                  component={Link}
                  disableRipple
                  href={routes.userOrder}
                  onClick={handleCloseNavAvatar}
                >
                  <Stack justifyContent="center" alignItems="center">
                    <IconButton
                      disableRipple
                      sx={{
                        "&.hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <ShoppingCartIcon />
                    </IconButton>
                    <Typography variant="caption">Order</Typography>
                  </Stack>
                </MenuItem>
              </Grid>

              <Grid item xs={4}>
                <MenuItem
                  sx={{ justifyContent: "center", borderRadius: 1 }}
                  component={Link}
                  disableRipple
                  href={routes.userSetting}
                  onClick={handleCloseNavAvatar}
                >
                  <Stack justifyContent="center" alignItems="center">
                    <IconButton
                      disableRipple
                      sx={{
                        "&.hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <SettingsIcon />
                    </IconButton>
                    <Typography variant="caption">Setting</Typography>
                  </Stack>
                </MenuItem>
              </Grid>
              <Grid item xs={4}>
                <MenuItem
                  sx={{ justifyContent: "center", borderRadius: 1 }}
                  disableRipple
                  onClick={() => {
                    handleCloseNavAvatar();
                    signOut();
                  }}
                >
                  <Stack justifyContent="center" alignItems="center">
                    <IconButton
                      disableRipple
                      sx={{
                        "&.hover": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <LogoutIcon />
                    </IconButton>
                    <Typography variant="caption"> Log out</Typography>
                  </Stack>
                </MenuItem>
              </Grid>
            </Grid>
          </Box>
          <Box pt={3} pb={2}>
            <Button
              href={routes.listingCreate}
              size="small"
              variant="outlined"
              endIcon={<AddIcon />}
            >
              add a Listing
            </Button>
          </Box>
        </Stack>
      </Menu>
    </>
  );
};

export default UserAvatar;

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
import Popper from "@mui/material/Popper";

import routes from "src/global/routes";

import { UserAvatarProps } from "./Types";

const UserAvatar: FC<UserAvatarProps> = () => {
  const [anchorElAvat, setAnchorElAvat] = useState<HTMLElement | null>(null);

  const handleOpenNavAvatar = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAvat(event.currentTarget);
  };

  const handleCloseNavAvatar = () => {
    setAnchorElAvat(null);
  };

  return (
    <>
      <IconButton onClick={handleOpenNavAvatar} sx={{ p: 0 }}>
        <Avatar>AD</Avatar>
      </IconButton>
      <Menu
        elevation={0}
        sx={{
          mt: { xs: -4.7, md: 5.7 },
          right: { xs: -16, md: 0 },
          left: { xs: -16, md: 0 },
        }}
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
        <Stack
          width={{ md: 310 }}
          justifyContent="center"
          alignItems="center"
          sx={{}}
        >
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

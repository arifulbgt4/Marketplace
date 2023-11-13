"use client";
import { FC, useState } from "react";
import { signOut } from "next-auth/react";
import {
  AppBar,
  Container,
  Toolbar,
  Box,
  IconButton,
  MenuItem,
  Button,
  Tooltip,
  Menu,
  Avatar,
  Hidden,
  Stack,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useSticky } from "src/global/hooks";
import Logo from "src/components/Logo";
import routes from "src/global/routes";

import { AvatarPopProps, HeaderProps } from "./Types";

const Header: FC<HeaderProps> = ({ user }) => {
  const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
  const [anchorElAvat, setAnchorElAvat] = useState<HTMLElement | null>(null);
  const { sticky, stickyRef } = useSticky(10);

  const handleOpenNavAvatar = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAvat(event.currentTarget);
  };

  const handleCloseNavAvatar = () => {
    setAnchorElAvat(null);
  };
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed" color="inherit" elevation={2}>
      <Container>
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
          variant="dense"
        >
          <Hidden mdUp implementation="css">
            <Stack>
              {user ? (
                <AvatarPop
                  handleCloseUserMenu={handleCloseUserMenu}
                  handleCloseNavAvatar={handleCloseNavAvatar}
                  anchorElAvat={anchorElAvat}
                  handleOpenNavAvatar={handleOpenNavAvatar}
                />
              ) : (
                <>
                  <Tooltip title="Menu">
                    <IconButton onClick={handleOpenUserMenu}>
                      <AccountCircleOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",

                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem
                      component={Link}
                      onClick={handleCloseUserMenu}
                      href={routes.signup}
                    >
                      Create Account
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseUserMenu}
                      href={routes.signin}
                      component={Link}
                    >
                      Sign In
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Stack>
          </Hidden>

          <Stack flexGrow={{ xs: 0, md: 1 }}>
            <Logo />
          </Stack>
          <Hidden mdDown implementation="css">
            <Stack flexDirection="row">
              <Box px={{ md: 1, lg: 2 }} py={0.75}>
                <Link
                  href={routes.search}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2 }}
                  color="text.primary"
                >
                  All Properties
                </Link>
              </Box>
              <Box px={{ md: 1, lg: 2 }} py={0.75}>
                <Link
                  color="text.primary"
                  href={routes.listingCreate}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2 }}
                >
                  Start selling
                </Link>
              </Box>
              <Box px={{ md: 1, lg: 2 }} py={0.75}>
                <Link
                  color="text.primary"
                  href={routes.about}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2 }}
                >
                  Abou us
                </Link>
              </Box>
              <Box px={{ md: 1, lg: 2 }} py={0.75}>
                <Link
                  color="text.primary"
                  href={routes.contact}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2 }}
                >
                  Contact us
                </Link>
              </Box>
            </Stack>
          </Hidden>

          <Box>
            {!user ? (
              <>
                <Hidden mdDown implementation="css">
                  <Stack flexDirection="row" gap={0.5}>
                    <Box p={1}>
                      <Link href={routes.signup} color="text.primary">
                        Create Account
                      </Link>
                    </Box>
                    <Button
                      component={Link}
                      href={routes.signin}
                      variant="outlined"
                      size="small"
                    >
                      Sign in
                    </Button>
                  </Stack>
                </Hidden>
                <Hidden mdUp implementation="css">
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenNavMenu} sx={{ p: 0 }}>
                      <MenuIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                  >
                    <MenuItem
                      component={Link}
                      onClick={handleCloseNavMenu}
                      href={routes.search}
                    >
                      All Property
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNavMenu}
                      component={Link}
                      href={routes.listingCreate}
                    >
                      Start selling
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNavMenu}
                      href={routes.about}
                      component={Link}
                    >
                      About us
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseUserMenu}
                      href={routes.contact}
                      component={Link}
                    >
                      Contact us
                    </MenuItem>
                  </Menu>
                </Hidden>
              </>
            ) : (
              <Stack>
                <Hidden mdUp implementation="css">
                  <IconButton onClick={handleOpenNavMenu} sx={{ p: 0 }}>
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                  >
                    <MenuItem
                      onClick={handleCloseNavMenu}
                      component={Link}
                      href={routes.search}
                    >
                      All Property
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNavMenu}
                      href={routes.listingCreate}
                      component={Link}
                    >
                      Start selling
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNavMenu}
                      href={routes.about}
                      component={Link}
                    >
                      About us
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseUserMenu}
                      href={routes.contact}
                      component={Link}
                    >
                      Contact us
                    </MenuItem>
                  </Menu>
                </Hidden>
                <Hidden mdDown implementation="css">
                  <AvatarPop
                    handleCloseUserMenu={handleCloseUserMenu}
                    handleCloseNavAvatar={handleCloseNavAvatar}
                    anchorElAvat={anchorElAvat}
                    handleOpenNavAvatar={handleOpenNavAvatar}
                  />
                </Hidden>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;

const AvatarPop: FC<AvatarPopProps> = ({
  handleCloseUserMenu,
  handleCloseNavAvatar,
  anchorElAvat,
  handleOpenNavAvatar,
}) => {
  return (
    <>
      <IconButton onClick={handleOpenNavAvatar} sx={{ p: 0 }}>
        <Avatar>AD</Avatar>
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
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
        <Grid container width={280} maxWidth="100%">
          <Grid
            item
            xs={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <MenuItem
              component={Link}
              href={routes.userDashboard}
              onClick={handleCloseNavAvatar}
            >
              <Stack justifyContent="center" alignItems="center">
                <IconButton>
                  <DashboardIcon />
                </IconButton>
                <Typography variant="caption">Dashboard</Typography>
              </Stack>
            </MenuItem>
          </Grid>
          <Grid
            item
            xs={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <MenuItem
              component={Link}
              href={routes.userDashboard}
              onClick={handleCloseNavAvatar}
            >
              <Stack justifyContent="center" alignItems="center">
                <IconButton>
                  <ManageAccountsIcon />
                </IconButton>
                <Typography variant="caption">Account</Typography>
              </Stack>
            </MenuItem>
          </Grid>
          <Grid
            item
            xs={4}
            display="flex"
            justifyContent="center"
            alignItems="end"
          >
            <MenuItem
              component={Link}
              href={`${routes.profile}/slug`}
              onClick={handleCloseNavAvatar}
            >
              <Stack justifyContent="center" alignItems="center">
                <IconButton>
                  <AccountCircleIcon />
                </IconButton>
                <Typography variant="caption">Profile</Typography>
              </Stack>
            </MenuItem>
          </Grid>
          <Grid
            item
            xs={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <MenuItem
              component={Link}
              href={routes.userSetting}
              onClick={handleCloseNavAvatar}
            >
              <Stack justifyContent="center" alignItems="center">
                <IconButton>
                  <SettingsIcon />
                </IconButton>
                <Typography variant="caption">Setting</Typography>
              </Stack>
            </MenuItem>
          </Grid>
          <Grid
            item
            xs={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <MenuItem
              component={Link}
              href={routes.userListing}
              onClick={handleCloseNavAvatar}
            >
              <Stack justifyContent="center" alignItems="center">
                <IconButton>
                  <ListAltIcon />
                </IconButton>
                <Typography variant="caption">Listing</Typography>
              </Stack>
            </MenuItem>
          </Grid>
          <Grid
            item
            xs={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <MenuItem
              component={Link}
              href={routes.userBookmark}
              onClick={handleCloseNavAvatar}
            >
              <Stack justifyContent="center" alignItems="center">
                <IconButton>
                  <BookmarksIcon />
                </IconButton>
                <Typography variant="caption">Bookmark</Typography>
              </Stack>
            </MenuItem>
          </Grid>
          <Grid
            item
            xs={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                signOut();
              }}
            >
              <Stack justifyContent="center" alignItems="center">
                <IconButton>
                  <LogoutIcon />
                </IconButton>
                <Typography variant="caption"> Log out</Typography>
              </Stack>
            </MenuItem>
          </Grid>
        </Grid>
      </Menu>
    </>
  );
};

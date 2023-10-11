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
  Link,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

import Logo from "src/components/Logo";
import routes from "src/global/routes";

import { HeaderProps } from "./Types";

const Header: FC<HeaderProps> = ({ user }) => {
  const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
  const [anchorElAvat, setAnchorElAvat] = useState<HTMLElement | null>(null);

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
    <AppBar position="sticky">
      <Container>
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Hidden mdUp implementation="css">
            <Stack>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenNavMenu}>
                  <Avatar>AD</Avatar>
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
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link
                    color="text.primary"
                    href={routes.listingCreate}
                    onClick={handleCloseNavMenu}
                  >
                    All Property
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link
                    color="text.primary"
                    href={routes.listingCreate}
                    onClick={handleCloseNavMenu}
                  >
                    Start selling
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link
                    color="text.primary"
                    href={routes.listingCreate}
                    onClick={handleCloseNavMenu}
                  >
                    About us
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Link
                    color="text.primary"
                    href={routes.listingCreate}
                    onClick={handleCloseNavMenu}
                  >
                    Contact
                  </Link>
                </MenuItem>
              </Menu>
            </Stack>
          </Hidden>
          <Hidden mdUp implementation="css">
            <Stack flexGrow={0.5}>
              <Logo />
            </Stack>
          </Hidden>
          <Stack flexGrow={1} display={{ xs: "none", md: "flex" }}>
            <Hidden mdDown implementation="css">
              <Logo />
            </Hidden>
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
                  <Stack flexDirection="row">
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
                      SignIn
                    </Button>
                  </Stack>
                </Hidden>
                <Hidden mdUp implementation="css">
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
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
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Link color="text.primary" href={routes.signup}>
                        Create Account
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Link color="text.primary" href={routes.signin}>
                        Sign In
                      </Link>
                    </MenuItem>
                  </Menu>
                </Hidden>
              </>
            ) : (
              <Stack>
                <Hidden mdUp implementation="css">
                  <IconButton onClick={handleOpenNavMenu}>
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
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Link
                        color="text.primary"
                        href={routes.listingCreate}
                        onClick={handleCloseNavMenu}
                      >
                        All Property
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Link
                        color="text.primary"
                        href={routes.listingCreate}
                        onClick={handleCloseNavMenu}
                      >
                        Start selling
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Link
                        color="text.primary"
                        href={routes.listingCreate}
                        onClick={handleCloseNavMenu}
                      >
                        About us
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Link
                        color="text.primary"
                        href={routes.listingCreate}
                        onClick={handleCloseNavMenu}
                      >
                        Contact
                      </Link>
                    </MenuItem>
                  </Menu>
                </Hidden>
                <Hidden mdDown implementation="css">
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenNavAvatar} sx={{ p: 0 }}>
                      <Avatar>AD</Avatar>
                    </IconButton>
                  </Tooltip>
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
                    <MenuItem onClick={handleCloseNavAvatar}>
                      <Link
                        color="text.primary"
                        href={routes.userProfile}
                        textAlign="center"
                      >
                        profile
                      </Link>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseUserMenu();
                        signOut();
                      }}
                    >
                      <Button component={Link} href={routes.signup}>
                        Log out
                      </Button>
                    </MenuItem>
                  </Menu>
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

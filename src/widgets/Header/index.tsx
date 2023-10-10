"use client";
import { FC, useState } from "react";
import { signOut } from "next-auth/react";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
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
        <Toolbar disableGutters>
          <Hidden mdDown>
            <Stack flexGrow={1}>
              <Logo />
            </Stack>
          </Hidden>
          <Hidden mdUp>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Hidden mdUp>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Stack sx={{ p: 0.5 }}>
                    <Link color="text.primary" href={routes.listings}>
                      All Properties
                    </Link>
                    <Link color="text.primary" href={routes.listingCreate}>
                      Start selling
                    </Link>
                    <Link color="text.primary" href={routes.about}>
                      Abou us
                    </Link>
                    <Link color="text.primary" href={routes.contact}>
                      Contact us
                    </Link>
                  </Stack>
                </MenuItem>
              </Menu>
            </Hidden>
          </Hidden>
          <Hidden mdUp>
            <Logo />
          </Hidden>
          <Hidden mdDown>
            <Box px={{ md: 1, lg: 2 }} py={0.75}>
              <Link
                href={routes.listings}
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
          </Hidden>
          <Box sx={{ flexGrow: 0, ml: 4 }}>
            {!user ? (
              <>
                <Hidden smDown>
                  <Stack flexDirection="row">
                    <Box p={1}>
                      <Link href={routes.signup} color="text.primary">
                        Create Account
                      </Link>
                    </Box>
                    <Button
                      href={routes.signin}
                      variant="outlined"
                      size="small"
                    >
                      SignIn
                    </Button>
                  </Stack>
                </Hidden>
                <Hidden smUp>
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
                      <Box>
                        <Link color="text.primary" href={routes.signup}>
                          Create Account
                        </Link>
                      </Box>
                    </MenuItem>
                    <MenuItem>
                      <Link color="text.primary" href={routes.signin}>
                        SignIn
                      </Link>
                    </MenuItem>
                  </Menu>
                </Hidden>
              </>
            ) : (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
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
                    <Typography textAlign="center">Log out</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;

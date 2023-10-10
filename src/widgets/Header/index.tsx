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
    <AppBar position="static">
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
                    <Link href={routes.listings}>All Properties</Link>
                    <Link href={routes.listingCreate}>Start selling</Link>
                    <Link href={routes.about}>Abou us</Link>
                    <Link href={routes.contact}>Contact us</Link>
                  </Stack>
                </MenuItem>
              </Menu>
            </Hidden>
          </Hidden>
          <Hidden mdUp>
            <Logo />
          </Hidden>
          <Hidden mdDown>
            <Button
              href={routes.listings}
              onClick={handleCloseNavMenu}
              sx={{ my: 2 }}
            >
              All Properties
            </Button>
            <Button
              href={routes.listingCreate}
              onClick={handleCloseNavMenu}
              sx={{ my: 2 }}
            >
              Start selling
            </Button>
            <Button
              href={routes.about}
              onClick={handleCloseNavMenu}
              sx={{ my: 2 }}
            >
              Abou us
            </Button>
            <Button
              href={routes.contact}
              onClick={handleCloseNavMenu}
              sx={{ my: 2 }}
            >
              Contact us
            </Button>
          </Hidden>
          <Box sx={{ flexGrow: 0, ml: 4 }}>
            {!user ? (
              <>
                <Button>Create Account</Button>
                <Button variant="outlined">SignIn</Button>
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
                    <Link href={routes.userProfile} textAlign="center">
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

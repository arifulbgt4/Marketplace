"use client";
import { FC, useState } from "react";
import {
  AppBar,
  Container,
  SvgIcon,
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import Logo from "src/components/Logo";

import { HeaderProps } from "./Types";

const pages = ["All Properties", "Start selling", "Abou us", "Contact us"];
// const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Header: FC<HeaderProps> = () => {
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
          <Hidden mdDown implementation="css">
            <Stack flexGrow={1}>
              <Logo />
            </Stack>
          </Hidden>

          <Hidden mdUp implementation="css">
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
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Hidden>
          </Hidden>
          <Hidden mdUp>
            <Logo />
          </Hidden>
          <Hidden mdDown implementation="css">
            {pages.map((page) => (
              <Button key={page} onClick={handleCloseNavMenu} sx={{ my: 2 }}>
                {page}
              </Button>
            ))}
          </Hidden>

          <Box sx={{ flexGrow: 0, ml: 4 }}>
            <Button onClick={handleOpenUserMenu}>Create Account</Button>
            <Button variant="outlined">SignIn</Button>
            {/* <Menu
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
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>*/}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;

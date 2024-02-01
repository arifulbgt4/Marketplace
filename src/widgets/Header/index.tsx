"use client";
import { FC, useState } from "react";
import {
  AppBar,
  Container,
  Toolbar,
  Box,
  IconButton,
  MenuItem,
  Menu,
  Hidden,
  Stack,
  Link,
} from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

import Logo from "src/components/Logo";
import routes from "src/global/routes";
import HeaderLanguage from "../HeaderLanguage";
import UserAvatar from "../UserAvatar";

import { HeaderProps } from "./Types";

const Header: FC<HeaderProps> = ({ user }) => {
  const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
  // const { sticky, stickyRef } = useSticky(10);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="fixed" color="inherit" elevation={0}>
      <Container>
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Logo />
          <Hidden mdDown>
            <Stack direction="row" justifyContent="end" alignItems="center">
              <HeaderLanguage />
              <Box>
                {!user ? (
                  <>
                    <IconButton onClick={handleOpenNavMenu} sx={{ p: 0 }}>
                      <AccountCircleRoundedIcon
                        sx={{
                          height: 45,
                          width: 45,
                          color: "primary.main",
                          "&:hover": { color: "primary.dark" },
                        }}
                      />
                    </IconButton>
                    <Menu
                      sx={{ mt: 5.5 }}
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
                        href={routes.signin}
                      >
                        Sign In
                      </MenuItem>
                      <MenuItem
                        onClick={handleCloseNavMenu}
                        component={Link}
                        href={routes.signup}
                      >
                        Sign Up
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <UserAvatar />
                )}
              </Box>
            </Stack>
          </Hidden>
        </Toolbar>
        <Hidden mdUp>
          <Toolbar
            sx={(theme) => ({
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: theme.palette.background.paper,
            })}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flex={1}
            >
              <HeaderLanguage />
              <Box>
                {!user ? (
                  <>
                    <IconButton onClick={handleOpenNavMenu} sx={{ p: 0 }}>
                      <AccountCircleRoundedIcon
                        sx={{
                          height: 45,
                          width: 45,
                          color: "primary.main",
                          "&:hover": { color: "primary.dark" },
                        }}
                      />
                    </IconButton>
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
                        horizontal: "right",
                      }}
                      open={Boolean(anchorElNav)}
                      onClose={handleCloseNavMenu}
                    >
                      <MenuItem
                        component={Link}
                        onClick={handleCloseNavMenu}
                        href={routes.signin}
                      >
                        Sign In
                      </MenuItem>
                      <MenuItem
                        onClick={handleCloseNavMenu}
                        component={Link}
                        href={routes.signup}
                      >
                        Sign Up
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <UserAvatar />
                )}
              </Box>
            </Stack>
          </Toolbar>
        </Hidden>
      </Container>
    </AppBar>
  );
};
export default Header;

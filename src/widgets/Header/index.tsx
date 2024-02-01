"use client";
import { FC, Suspense, useState } from "react";
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
  Modal,
  Typography,
  Paper,
} from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import CloseIcon from "@mui/icons-material/Close";

import Logo from "src/components/Logo";
import routes from "src/global/routes";
import SearchFilterForm from "src/forms/SearchFilterForm";
import HeaderLanguage from "../HeaderLanguage";
import UserAvatar from "../UserAvatar";

import { HeaderProps } from "./Types";

const Header: FC<HeaderProps> = ({ user }) => {
  const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
  const [openModal, setOpenModal] = useState(false);
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
          <Hidden mdUp>
            <IconButton
              type="submit"
              size="small"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              <SearchSharpIcon
                sx={(theme) => ({
                  height: 24,
                  width: 24,
                })}
              />
            </IconButton>
            <Modal
              open={openModal}
              onClose={() => {
                setOpenModal(false);
              }}
              slotProps={{
                backdrop: {
                  sx: {
                    backgroundColor: "transparent",
                  },
                },
              }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              sx={{ bgcolor: "transparent", top: 48 }}
            >
              <Stack
                component={Paper}
                gap={1}
                px={2.8}
                pt={2}
                pb={3.5}
                position="relative"
                sx={{
                  borderBottomRightRadius: 18,
                  borderBottomLeftRadius: 18,
                }}
              >
                <Typography variant="h5">Where to ?</Typography>
                <Suspense>
                  <SearchFilterForm
                    size="small"
                    onClose={() => {
                      setOpenModal(false);
                    }}
                  />
                </Suspense>
                {/* <Box position="absolute" bottom={10} left="45%">
                  <IconButton
                    size="small"
                    sx={(theme) => ({
                      bgcolor: theme.palette.action.disabled,
                    })}
                    onClick={() => {
                      setOpenModal(false);
                    }}
                  >
                    <CloseIcon
                      sx={{ height: 18, width: 18 }}
                      fontSize="small"
                    />
                  </IconButton>
                </Box> */}
              </Stack>
            </Modal>
          </Hidden>
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

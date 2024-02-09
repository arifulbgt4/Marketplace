import { FC, useState } from "react";
import {
  IconButton,
  Link,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Paper,
  Stack,
} from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import routes from "src/global/routes";

import { UserLogInProps } from "./Types";

const UserLogIn: FC<UserLogInProps> = () => {
  const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  return (
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
        elevation={24}
        sx={(theme) => ({
          mt: { xs: -4.7, md: 7.9 },
          right: { xs: -16, md: 0 },
          left: { xs: -16, md: 3 },
          mb: { xs: 7, md: 0 },
          background: "transparent",
          backdropFilter: "blur(2px)",
          "& .MuiMenu-paper": {
            borderTopRightRadius: { xs: 24, md: 0 },
            borderTopLeftRadius: { xs: 24, md: 0 },
            borderBottomRightRadius: { xs: 0, md: 18 },
            borderBottomLeftRadius: { xs: 0, md: 18 },
            boxShadow: { xs: 15, md: 4 },
            top: { md: "0px !important" },
            bgcolor: "Background.paper",
          },
        })}
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
        <Stack width={{ xs: "100vw", md: 320 }} height={{ md: 150 }}>
          <ListItem
            disablePadding
            component={Link}
            onClick={handleCloseNavMenu}
            href={routes.signin}
          >
            <ListItemButton sx={{ pr: 3 }}>
              <LoginIcon sx={{ color: "text.secondary" }} />

              <ListItemText
                sx={{ color: "text.secondary", pl: 2, fontWeight: 600 }}
                primary="Sign In"
              />
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            onClick={handleCloseNavMenu}
            component={Link}
            href={routes.signup}
          >
            <ListItemButton>
              <PersonAddIcon sx={{ color: "text.secondary" }} />

              <ListItemText
                sx={{ color: "text.secondary", pl: 2, fontWeight: 600 }}
                primary=" Sign Up"
              />
            </ListItemButton>
          </ListItem>
        </Stack>
      </Menu>
    </>
  );
};

export default UserLogIn;

import { FC, useState } from "react";
import {
  IconButton,
  Link,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  Stack,
} from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

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
        elevation={0}
        sx={(theme) => ({
          mt: { xs: -4.7, md: 7.9 },
          right: { xs: -16, md: 0 },
          left: { xs: -16, md: 0 },
          mb: { xs: 7, md: 0 },
          background: "transparent",
          backdropFilter: "blur(2px)",
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
        <Stack width={{ xs: "100vw", md: 310 }}>
          <ListItem
            disablePadding
            component={Link}
            onClick={handleCloseNavMenu}
            href={routes.signin}
          >
            <ListItemButton sx={{ pr: 3 }}>
              <ListItemText
                sx={{ textAlign: "end", color: "text.secondary" }}
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
              <ListItemText
                sx={{ textAlign: "end", color: "text.secondary" }}
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

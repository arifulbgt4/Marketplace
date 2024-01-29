import { Theme, Components } from "@mui/material/styles";

const MuiMenu: Components<Theme>["MuiMenu"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
    paper: ({ theme, ownerState }) => ({
      [theme.breakpoints.down("md")]: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
      },
    }),
  },
};

const MuiMenuItem: Components<Theme>["MuiMenuItem"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
};

const MuiMenuList: Components<Theme>["MuiMenuList"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
};

export default {
  MuiMenu,
  MuiMenuItem,
  MuiMenuList,
};

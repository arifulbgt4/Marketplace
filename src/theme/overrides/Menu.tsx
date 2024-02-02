import { Theme, Components } from "@mui/material/styles";

const MuiMenu: Components<Theme>["MuiMenu"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
    paper: ({ theme, ownerState }) => ({
      [theme.breakpoints.down("md")]: {
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
      },
      [theme.breakpoints.up("md")]: {
        top: "0px !important",
      },
    }),
  },
};

const MuiMenuItem: Components<Theme>["MuiMenuItem"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
};

const MuiMenuList: Components<Theme>["MuiPopover"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
    paper: ({ theme, ownerState }) => ({}),
  },
};

export default {
  MuiMenu,
  MuiMenuItem,
  MuiMenuList,
};

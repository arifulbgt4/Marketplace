import { Theme, Components } from "@mui/material/styles";

const MuiTab: Components<Theme>["MuiTab"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({
      ...(ownerState.icon &&
        ownerState.label && {
          minHeight: 48,
        }),
    }),
  },
};

const MuiTabs: Components<Theme>["MuiTabs"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
    scrollButtons: ({ theme, ownerState }) => ({
      width: "auto",
    }),
  },
};

export default { MuiTab, MuiTabs };

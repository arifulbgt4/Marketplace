import { Theme, Components } from "@mui/material/styles";

const MuiAppBar: Components<Theme>["MuiAppBar"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
};

const MuiToolbar: Components<Theme>["MuiToolbar"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
    dense: ({ theme, ownerState }) => ({
      minHeight: 64,
    }),
  },
};

export default { MuiAppBar, MuiToolbar };

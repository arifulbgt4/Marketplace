import { Theme, Components } from "@mui/material/styles";

const MuiContainer: Components<Theme>["MuiContainer"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
  defaultProps: {
    maxWidth: "xxl",
  },
};

export default {
  MuiContainer,
};

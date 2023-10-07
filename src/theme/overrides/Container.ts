import { Theme, Components } from "@mui/material/styles";

const MuiContainer: Components<Theme>["MuiContainer"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
  defaultProps: {
    maxWidth: "lg",
  },
};

export default {
  MuiContainer,
};

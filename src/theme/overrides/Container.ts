import { Theme, Components } from "@mui/material/styles";

const MuiContainer: Components<Theme>["MuiContainer"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
  defaultProps: {
    maxWidth: "xl",
  },
};

export default {
  MuiContainer,
};

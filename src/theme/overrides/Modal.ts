import { Theme, Components } from "@mui/material/styles";

const MuiModal: Components<Theme>["MuiModal"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
    backdrop: ({ theme, ownerState }) => ({
      background: "transparent",
      backdropFilter: "blur(2px)",
    }),
  },
};

export default { MuiModal };

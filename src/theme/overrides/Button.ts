import { Theme, Components, alpha } from "@mui/material/styles";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    rounded: true;
  }
  interface ButtonPropsColorOverrides {}
  interface ButtonPropsSizeOverrides {}
}

const MuiButton: Components<Theme>["MuiButton"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
  variants: [
    {
      props: { variant: "rounded" },
      style: ({ theme }) => ({
        borderRadius: 20,
        background: alpha(
          theme.palette.text.primary,
          theme.palette.action.hoverOpacity
        ),
      }),
    },
  ],
};
const MuiButtonBase: Components<Theme>["MuiButtonBase"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
};
const MuiIconButton: Components<Theme>["MuiIconButton"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
};

export default { MuiButton, MuiButtonBase, MuiIconButton };

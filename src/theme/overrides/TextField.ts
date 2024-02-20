import { Theme, Components } from "@mui/material/styles";

const MuiTextField: Components<Theme>["MuiTextField"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
};

const MuiInput: Components<Theme>["MuiInput"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
    input: ({ theme, ownerState }) => ({}),
  },
};

const MuiFilledInput: Components<Theme>["MuiFilledInput"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({
      [theme.breakpoints.up("xs")]: {
        minHeight: 50,
      },
      [theme.breakpoints.up("md")]: {
        minHeight: 72,
      },
      background: "none",
      "&:hover": {
        background: "transparent",
      },
      "&::before": {
        content: "none",
        borderBottom: "none",
      },
      "&.Mui-focused": {
        backgroundColor: "transparent",
        "&:hover": {
          background: "transparent",
        },
      },
    }),

    underline: ({ theme, ownerState }) => ({
      "&::after": {
        borderBottom: "none",
      },
    }),
  },
};

const MuiInputAdornment: Components<Theme>["MuiInputAdornment"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
};

const MuiInputBase: Components<Theme>["MuiInputBase"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
};

const MuiInputLabel: Components<Theme>["MuiInputLabel"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
};
const MuiOutlinedInput: Components<Theme>["MuiOutlinedInput"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
};

export default {
  MuiTextField,
  MuiInput,
  MuiFilledInput,
  MuiInputAdornment,
  MuiInputBase,
  MuiInputLabel,
  MuiOutlinedInput,
};

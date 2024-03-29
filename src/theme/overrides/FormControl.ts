import { Theme, Components } from "@mui/material/styles";

const MuiFormControl: Components<Theme>["MuiFormControl"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
};

const MuiAutocomplete: Components<Theme>["MuiAutocomplete"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({
      "&:hover": {
        background: theme.palette.action.hover,
        borderRadius: 50,
        boxShadow: "0px 3px 6px #00000029",
      },
      "&.Mui-focused": {
        backgroundColor: theme.palette.action.hover,
        borderRadius: 50,
      },
    }),
  },
};

const MuiFormControlLabel: Components<Theme>["MuiFormControlLabel"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
};

const MuiFormGroup: Components<Theme>["MuiFormGroup"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
};

const MuiFormHelperText: Components<Theme>["MuiFormHelperText"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
};

const MuiFormLabel: Components<Theme>["MuiFormLabel"] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => ({}),
  },
};

export default {
  MuiFormControl,
  MuiAutocomplete,
  MuiFormGroup,
  MuiFormControlLabel,
  MuiFormHelperText,
  MuiFormLabel,
};

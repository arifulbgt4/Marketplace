import { PaletteOptions } from "./";

export default {
  primary: {
    dark: "#1565c0",
    main: "#1976d2",
    light: "#42a5f5",
    contrastText: "#fff",
  },
  secondary: {
    dark: "#7b1fa2",
    main: "#9c27b0",
    light: "#ba68c8",
    contrastText: "#fff",
  },
  error: {
    dark: "#c62828",
    main: "#d32f2f",
    light: "#ef5350",
    contrastText: "#fff",
  },
  warning: {
    dark: "#e65100",
    main: "#ed6c02",
    light: "#ff9800",
    contrastText: "#fff",
  },
  info: {
    dark: "#01579b",
    main: "#0288d1",
    light: "#03a9f4",
    contrastText: "#fff",
  },
  success: {
    dark: "#1b5e20",
    main: "#2e7d32",
    light: "#4caf50",
    contrastText: "#fff",
  },
  grey: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    A100: "#f5f5f5",
    A200: "#eeeeee",
    A400: "#bdbdbd",
    A700: "#616161",
  },
  text: {
    primary: "rgb(10, 37, 64)",
    secondary: "rgb(66, 84, 102)",
    disabled: "rgb(26, 31, 54)",
  },
  action: {
    active: "rgba(0, 0, 0, 0.54)",
    hover: "rgba(0, 0, 0, 0.04)",
    hoverOpacity: 0.04,
    selected: "rgba(0, 0, 0, 0.08)",
    selectedOpacity: 0.08,
    disabled: "rgba(0, 0, 0, 0.26)",
    disabledOpacity: 0.38,
    disabledBackground: "rgba(0, 0, 0, 0.12)",
    focus: "rgba(0, 0, 0, 0.12)",
    focusOpacity: 0.12,
    activatedOpacity: 0.12,
  },
  background: {
    default: "#f6f9fc",
    paper: "#fff",
  },
  common: {
    black: "#000",
    white: "#fff",
  },
  shadows: {
    transparentOne: "rgba(0,0,0,0.1)",
    transparentTwo: "rgba(50,50,93,0.25)",
    transparentThree: "rgba(0,0,0,0.12)",
  },
  divider: "rgba(0, 0, 0, 0.12)",
} as PaletteOptions;

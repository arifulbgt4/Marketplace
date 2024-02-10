import {
  TypographyVariants as TypographyVariantsOption,
  createTheme,
  useTheme,
} from "@mui/material/styles";
import { Rubik, Roboto } from "next/font/google";
import breakpoints from "./breakpoints";

export const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});
export const rubik = Rubik({
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export interface TypographyVariants extends TypographyVariantsOption {}

const theme = createTheme({ breakpoints });

export default {
  fontFamily: `${roboto.style.fontFamily}, ${rubik.style.fontFamily}`,
  htmlFontSize: 16,
  fontSize: 14,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    ...rubik.style,
    fontWeight: 500,
    fontSize: "3.5rem",
    lineHeight: 1.167,
    letterSpacing: "0.01em",
    [theme.breakpoints.down("md")]: {
      fontSize: "1.5rem",
    },
  },
  h2: {
    ...rubik.style,
    fontWeight: 500,
    fontSize: "1.75rem",
    lineHeight: 1.263157895,
    letterSpacing: "-0.013",
  },
  h3: {
    ...roboto.style,
    fontWeight: 400,
    fontSize: "1.25rem",
    lineHeight: 1.384615385,
    letterSpacing: "0.01em",
    [theme.breakpoints.down("md")]: {
      fontSize: "1rem",
    },
  },
  h4: {
    ...roboto.style,
    fontWeight: 500,
    fontSize: "1.5rem",
    lineHeight: 1.33333,
    letterSpacing: "0.006",
  },
  h5: {
    ...roboto.style,
    fontWeight: 500,
    fontSize: "1.25rem",
    lineHeight: 1.334,
    letterSpacing: "0em",
  },
  h6: {
    ...roboto.style,
    fontWeight: 500,
    fontSize: "1.125rem",
    lineHeight: 1.6,
    letterSpacing: "0.0075em",
  },
  subtitle1: {
    ...roboto.style,
    fontWeight: 400,
    fontSize: "1.125rem",
    lineHeight: 1.75,
    letterSpacing: "0.013em",
  },
  subtitle2: {
    ...roboto.style,
    fontWeight: 500,
    fontSize: "1rem",
    lineHeight: 1.57,
    letterSpacing: "0.013em",
  },
  body1: {
    ...roboto.style,
    fontWeight: 300,
    fontSize: "1.125rem",
    lineHeight: 1.555555556,
    letterSpacing: "0.013em",
  },
  body2: {
    ...roboto.style,
    fontWeight: 400,
    fontSize: "0.938rem",
    lineHeight: 1.4,
    letterSpacing: "0.01071em",
  },
  button: {
    ...roboto.style,
    fontWeight: 500,
    fontSize: "0.938rem",
    lineHeight: 1.6,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  caption: {
    ...rubik.style,
    fontWeight: 400,
    fontSize: "0.938rem",
    lineHeight: 1.6,
    letterSpacing: "0.01875em",
  },
  overline: {
    ...rubik.style,
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: 2.66,
    letterSpacing: "0.013em",
    textTransform: "uppercase",
  },
} as TypographyVariants;

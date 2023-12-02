import { TypographyVariants as TypographyVariantsOption } from "@mui/material/styles";
import { DM_Sans } from "next/font/google";

export const dm_sans = DM_Sans({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export interface TypographyVariants extends TypographyVariantsOption {}

export default {
  fontFamily: `${dm_sans.style.fontFamily}`,
  htmlFontSize: 16,
  fontSize: 14,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    ...dm_sans.style,
    fontWeight: 500,
    fontSize: "3.5rem",
    lineHeight: 1.167,
    letterSpacing: "-0.02em",
  },
  h2: {
    ...dm_sans.style,
    fontWeight: 500,
    fontSize: "2.5rem",
    lineHeight: 1.263157895,
    letterSpacing: "-0.013",
  },
  h3: {
    ...dm_sans.style,
    fontWeight: 400,
    fontSize: "1.62rem",
    lineHeight: 1.384615385,
    letterSpacing: "0em",
  },
  h4: {
    ...dm_sans.style,
    fontWeight: 500,
    fontSize: "1.5rem",
    lineHeight: 1.33333,
    letterSpacing: "0.006",
  },
  h5: {
    ...dm_sans.style,
    fontWeight: 500,
    fontSize: "1.25rem",
    lineHeight: 1.334,
    letterSpacing: "0em",
  },
  h6: {
    ...dm_sans.style,
    fontWeight: 500,
    fontSize: "1.125rem",
    lineHeight: 1.6,
    letterSpacing: "0.0075em",
  },
  subtitle1: {
    ...dm_sans.style,
    fontWeight: 400,
    fontSize: "1.125rem",
    lineHeight: 1.75,
    letterSpacing: "0.013em",
  },
  subtitle2: {
    ...dm_sans.style,
    fontWeight: 500,
    fontSize: "0.834rem",
    lineHeight: 1.57,
    letterSpacing: "0.013em",
  },
  body1: {
    ...dm_sans.style,
    fontWeight: 300,
    fontSize: "1.125rem",
    lineHeight: 1.555555556,
    letterSpacing: "0.013em",
  },
  body2: {
    ...dm_sans.style,
    fontWeight: 400,
    fontSize: "0.938rem",
    lineHeight: 1.4,
    letterSpacing: "0.01071em",
  },
  button: {
    ...dm_sans.style,
    fontWeight: 500,
    fontSize: "0.938rem",
    lineHeight: 1.6,
    letterSpacing: "0.013em",
    textTransform: "uppercase",
  },
  caption: {
    ...dm_sans.style,
    fontWeight: 300,
    fontSize: "0.688rem",
    lineHeight: 1.6,
    letterSpacing: "0.01875em",
  },
  overline: {
    ...dm_sans.style,
    fontWeight: 400,
    fontSize: "0.688rem",
    lineHeight: 2.66,
    letterSpacing: "0.013em",
    textTransform: "uppercase",
  },
} as TypographyVariants;

import { BreakpointsOptions } from "@mui/material";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
    mobile: false; // adds the `mobile` breakpoint
    tablet: false;
    laptop: false;
    desktop: false;
  }
}

export default {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
    xxl: 1920,
  },
} as BreakpointsOptions;

import { FC } from "react";
import { Grid, Stack, Typography } from "@mui/material";

import { siteConfig } from "src/global/config";

import { FooterProps } from "./Types";

const Footer: FC<FooterProps> = () => {
  return (
    <Stack justifyContent="center">
      <Grid container maxWidth={siteConfig.maxWidth}>
        <Grid item xs={12}>
          <Typography>@copyright 2023</Typography>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Footer;

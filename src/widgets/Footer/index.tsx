import { FC } from "react";
import { Grid, Stack, Typography } from "@mui/material";

import { FooterProps } from "./Types";
import { siteConfig } from "src/global/config";

const Footer: FC<FooterProps> = () => {
  return (
    <Stack justifyContent="center" alignItems="center">
      <Grid container maxWidth={siteConfig.maxWidth}>
        <Grid item xs={12}>
          <Typography>@copyright 2023</Typography>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Footer;

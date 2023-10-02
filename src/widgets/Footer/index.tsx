import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { FooterProps } from "./Types";

const Footer: FC<FooterProps> = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography>@copyright 2023</Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;

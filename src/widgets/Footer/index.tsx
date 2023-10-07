import { FC } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";

import { FooterProps } from "./Types";

const Footer: FC<FooterProps> = () => {
  return (
    <Box>
      <Container>
        <Grid container>
          <Grid item xs={12}>
            <Typography>@copyright 2023</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;

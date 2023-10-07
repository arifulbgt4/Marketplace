import { FC } from "react";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";

import { FooterProps } from "./Types";
import SocialIconLink from "../SocialIconLink";
import Logo from "src/components/Logo";

const Footer: FC<FooterProps> = () => {
  return (
    <Box>
      <Container>
        <Grid container gap={10} pt={15} pb={10}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" gap={24}>
              <Stack gap={2}>
                <Typography variant="h6">PRIVACY POLICY</Typography>
                <Typography>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur ma
                </Typography>
                <Typography> Louis Vuitton</Typography>
              </Stack>
              <Stack gap={2}>
                <Typography variant="h6">LOCATION</Typography>
                <Typography>
                  2972 Westheimer Rd. Santa Ana, Illinois 85486
                </Typography>
              </Stack>
              <Stack gap={2}>
                <Typography variant="h6">CONTACT US</Typography>
                <Typography>michelle.rivera@example.com</Typography>
                <Typography> (480) 555-0103</Typography>
              </Stack>
              <Stack gap={2}>
                <Typography variant="h6">COMMUNITIES</Typography>
                <Typography>
                  3517 W. Gray St. Utica, Pennsylvania 57867
                </Typography>
                <Typography> (217) 555-0113</Typography>
                <Typography>Acme Co.</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="column" alignItems="center" gap={4}>
              <SocialIconLink />
              <Logo />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;

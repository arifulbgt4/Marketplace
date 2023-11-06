import { FC } from "react";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";

import SocialIconLink from "src/components/SocialILink";
import Logo from "src/components/Logo";

import { FooterProps } from "./Types";

const Footer: FC<FooterProps> = () => {
  return (
    <Box bgcolor="action.hover" boxShadow={2}>
      <Container>
        <Grid container gap={10} pt={15} pb={10}>
          <Grid item xs={12} container columnSpacing={5} rowSpacing={5}>
            <Grid item lg={3} sm={6} xs={12}>
              <Stack gap={2} padding={{ xs: 1, md: 0 }}>
                <Typography variant="h6">PRIVACY POLICY</Typography>
                <Typography color="text.secondary">
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur ma
                </Typography>
                <Typography color="text.secondary"> Louis Vuitton</Typography>
              </Stack>
            </Grid>
            <Grid item lg={3} sm={6} xs={12}>
              <Stack gap={2} padding={{ xs: 1, md: 0 }}>
                <Typography variant="h6">LOCATION</Typography>
                <Typography color="text.secondary">
                  2972 Westheimer Rd. Santa Ana, Illinois 85486
                </Typography>
              </Stack>
            </Grid>
            <Grid item lg={3} sm={6} xs={12}>
              <Stack gap={2} padding={{ xs: 1, md: 0 }}>
                <Typography variant="h6">CONTACT US</Typography>
                <Typography color="text.secondary">
                  michelle.rivera@example.com
                </Typography>
                <Typography color="text.secondary"> (480) 555-0103</Typography>
              </Stack>
            </Grid>
            <Grid item lg={3} sm={6} xs={12}>
              <Stack gap={2} padding={{ xs: 1, md: 0 }}>
                <Typography variant="h6">COMMUNITIES</Typography>
                <Typography>
                  3517 W. Gray St. Utica, Pennsylvania 57867
                </Typography>
                <Typography color="text.secondary"> (217) 555-0113</Typography>
                <Typography color="text.secondary">Acme Co.</Typography>
              </Stack>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              gap={4}
            >
              <SocialIconLink />
              <Box pl={2}>
                <Logo />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;

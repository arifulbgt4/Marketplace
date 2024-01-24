import { FC } from "react";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";

import SocialIconLink from "src/components/SocialILink";
import Logo from "src/components/Logo";

import { FooterProps } from "./Types";
import Link from "next/link";
import routes from "src/global/routes";

const Footer: FC<FooterProps> = () => {
  return (
    <Box bgcolor="action.hover" boxShadow={2}>
      <Container maxWidth="md">
        <Grid
          container
          py={{ xs: 5, lg: 10 }}
          gap={3}
          display="flex"
          justifyContent="space-between"
        >
          <Grid item lg={3} sm={6} xs={12}>
            <Stack gap={2} padding={{ xs: 1, md: 0 }}>
              <Typography variant="h5">LINKS</Typography>
              <Typography
                sx={{ textDecoration: "none" }}
                component={Link}
                href={routes.search}
                color="text.secondary"
              >
                PROPERTIES
              </Typography>
              <Typography
                sx={{ textDecoration: "none" }}
                component={Link}
                href={"#"}
                color="text.secondary"
              >
                OPEN A SHOP
              </Typography>
              <Typography
                sx={{ textDecoration: "none" }}
                component={Link}
                href={routes.about}
                color="text.secondary"
              >
                ABOUT US
              </Typography>
              <Typography
                sx={{ textDecoration: "none" }}
                component={Link}
                href={routes.contact}
                color="text.secondary"
              >
                CONTACT US
              </Typography>
              <Typography
                sx={{ textDecoration: "none" }}
                component={Link}
                href={"#"}
                color="text.secondary"
              >
                PRIVACY POLICY
              </Typography>
              <Typography
                sx={{ textDecoration: "none" }}
                component={Link}
                href={"#"}
                color="text.secondary"
              >
                TERMS OF SERVICE
              </Typography>
            </Stack>
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <Stack gap={2}>
              <Typography variant="h5">CONTACT</Typography>
              <Typography color="text.secondary">
                2972 Westheimer Rd. Santa Ana, Illinois 85486
              </Typography>
              <Typography color="text.secondary">(239) 555-0108</Typography>
              <Typography color="text.secondary">(702) 555-0122</Typography>
              <Typography color="text.secondary">
                kenzi.lawson@example.com
              </Typography>
            </Stack>
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <Stack
              direction="column"
              padding={{ xs: 1, md: 0 }}
              gap={{ lg: 4, xs: 2 }}
              alignItems="flex-start"
            >
              <Logo />
              <Typography color="text.secondary">
                Lorem ipsum dolor sit amet consectetur. Ornare at et bibendum mi
                enim cum.
              </Typography>
              <Typography variant="h5">FOLLOW ON</Typography>
              <SocialIconLink />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;

"use client";
import { FC } from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/LocalPhone";

import SocialIconLink from "src/components/SocialILink";
import Logo from "src/components/Logo";

import { FooterProps } from "./Types";
import Link from "next/link";
import routes from "src/global/routes";
import { siteConfig } from "src/global/config";

const Footer: FC<FooterProps> = () => {
  return (
    <Container
      sx={(theme) => ({
        background: theme.palette.background.default,
        mt: 6,
      })}
    >
      <Grid container>
        <Grid
          item
          xs={12}
          container
          py={5}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={4}>
            <Logo />
            {/* <Stack gap={2} flexDirection="row">
              <Box>
                <Typography color="text.secondary">Email</Typography>
                <Typography color="text.secondary">
                  kenzi.lawson@example.com
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary">Phone Number</Typography>
                <Typography color="text.secondary">+ (239) 555-0108</Typography>
              </Box>
            </Stack> */}
          </Grid>
          <Grid item xs={4}>
            <Stack
              gap={2}
              padding={{ xs: 1, md: 0 }}
              flexDirection="row"
              justifyContent="space-around"
            >
              <Typography
                sx={{ textDecoration: "none" }}
                component={Link}
                href={routes.about}
                color="text.secondary"
              >
                About
              </Typography>
              <Typography
                sx={{ textDecoration: "none" }}
                component={Link}
                href={"#"}
                color="text.secondary"
              >
                Blog
              </Typography>
              <Typography
                sx={{ textDecoration: "none" }}
                component={Link}
                href={routes.contact}
                color="text.secondary"
              >
                Contact
              </Typography>
              <Typography
                sx={{ textDecoration: "none" }}
                component={Link}
                href={"#"}
                color="text.secondary"
              >
                FAQ
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <SocialIconLink />
            {/* <Typography variant="h5" maxWidth={260}>
              Join our newsletter to keep up to date with us!
            </Typography>
            <Stack>
              <TextField />
              <Button variant="contained">Subscribe</Button>
            </Stack> */}
          </Grid>
        </Grid>
        <Grid item xs={12} container pb={4}>
          <Grid item xs={6}>
            <Stack flexDirection="row">
              <Typography>
                © {new Date().getFullYear()} {siteConfig.name}
              </Typography>
              <Stack flexDirection="row" ml={2} gap={2}>
                <Typography
                  sx={{ textDecoration: "none" }}
                  component={Link}
                  href={"#"}
                  color="text.secondary"
                >
                  Termas
                </Typography>
                <Typography
                  sx={{ textDecoration: "none" }}
                  component={Link}
                  href={"#"}
                  color="text.secondary"
                >
                  Privacy
                </Typography>
                <Typography
                  sx={{ textDecoration: "none" }}
                  component={Link}
                  href={"#"}
                  color="text.secondary"
                >
                  Cookies
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid
            item
            xs={6}
            alignContent="end"
            justifyContent="end"
            component={Stack}
          >
            <Stack
              alignItems="center"
              justifyContent="center"
              flexDirection="row"
              mr={2}
            >
              <PhoneIcon fontSize="small" />
              <Typography
                sx={{ textDecoration: "none", ml: 0.5 }}
                component={Link}
                href={"#"}
                color="text.secondary"
              >
                + (123) 456789
              </Typography>
            </Stack>
            <Stack
              alignItems="center"
              justifyContent="center"
              flexDirection="row"
            >
              <EmailIcon fontSize="small" />
              <Typography
                sx={{ textDecoration: "none", ml: 0.5 }}
                component={Link}
                href={"#"}
                color="text.secondary"
              >
                email@example.info
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      {/* <Container maxWidth="md">
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
      </Container> */}
    </Container>
  );
};

export default Footer;

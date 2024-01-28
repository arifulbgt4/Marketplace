"use client";
import { FC } from "react";
import { Container, Grid, Stack, Typography, Link } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/LocalPhone";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import routes from "src/global/routes";
import { siteConfig } from "src/global/config";
import Logo from "src/components/Logo";

import { FooterProps } from "./Types";

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
          spacing={2.5}
          pt={5}
          pb={3}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item md={4} xs={12}>
            <Stack
              justifyContent={{ xs: "center", md: "flex-start" }}
              alignItems={{ xs: "center", md: "flex-start" }}
            >
              <Logo />
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack
              gap={2}
              flexDirection="row"
              justifyContent="space-around"
              flexWrap="wrap"
            >
              <Typography
                sx={{ textDecoration: "none" }}
                component={Link}
                href={routes.about}
                color="text.primary"
                variant="subtitle2"
              >
                About
              </Typography>
              <Typography
                sx={{ textDecoration: "none" }}
                component={Link}
                href={routes.blog}
                color="text.primary"
                variant="subtitle2"
              >
                Blog
              </Typography>
              <Typography
                sx={{ textDecoration: "none" }}
                component={Link}
                href={routes.contact}
                color="text.primary"
                variant="subtitle2"
              >
                Contact
              </Typography>
              <Typography
                sx={{ textDecoration: "none" }}
                component={Link}
                href={routes.faq}
                color="text.primary"
                variant="subtitle2"
              >
                FAQ
              </Typography>
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={{ xs: "center", md: "end" }}
              gap={2}
            >
              <Link href="#" target="_blank">
                <TwitterIcon
                  sx={(theme) => ({
                    width: 22,
                    height: 22,
                    color: theme.palette.text.primary,
                  })}
                />
              </Link>
              <Link href="#" target="_blank">
                <FacebookRoundedIcon
                  sx={(theme) => ({
                    width: 22,
                    height: 22,
                    color: theme.palette.text.primary,
                  })}
                />
              </Link>
              <Link href="#" target="_blank">
                <InstagramIcon
                  sx={(theme) => ({
                    width: 22,
                    height: 22,
                    color: theme.palette.text.primary,
                  })}
                />
              </Link>
              <Link href="#" target="_blank">
                <LinkedInIcon
                  sx={(theme) => ({
                    width: 22,
                    height: 22,
                    color: theme.palette.text.primary,
                  })}
                />
              </Link>
            </Stack>
          </Grid>
        </Grid>
        <Grid item xs={12} container pb={3} spacing={1}>
          <Grid item xs={12} md={6}>
            <Stack
              flexDirection="row"
              flexWrap="wrap"
              justifyContent={{ xs: "center", md: "start" }}
              alignItems={{ xs: "center", md: "start" }}
            >
              <Typography variant="caption" color="text.secondary">
                © {new Date().getFullYear()} {siteConfig.name}
              </Typography>
              <Stack flexDirection="row" ml={2} gap={2}>
                <Typography
                  sx={{ textDecoration: "none" }}
                  component={Link}
                  href={routes.termas}
                  variant="caption"
                  color="text.secondary"
                >
                  Termas
                </Typography>
                <Typography
                  sx={{ textDecoration: "none" }}
                  component={Link}
                  href={routes.privacy}
                  variant="caption"
                  color="text.secondary"
                >
                  Privacy
                </Typography>
                <Typography
                  sx={{ textDecoration: "none" }}
                  component={Link}
                  href={routes.cookies}
                  variant="caption"
                  color="text.secondary"
                >
                  Cookies
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            justifyContent={{ xs: "center", md: "end" }}
            alignItems={{ xs: "center", md: "end" }}
            flexWrap="wrap"
            component={Stack}
          >
            <Stack
              alignItems="center"
              justifyContent="center"
              flexDirection="row"
              mr={3}
            >
              <PhoneIcon
                sx={(theme) => ({
                  height: 16,
                  width: 16,
                  color: theme.palette.text.secondary,
                })}
              />
              <Typography
                sx={{ textDecoration: "none", ml: 0.5 }}
                component={Link}
                href={"#"}
                variant="caption"
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
              <EmailIcon
                sx={(theme) => ({
                  height: 16,
                  width: 16,
                  color: theme.palette.text.secondary,
                })}
              />
              <Typography
                sx={{ textDecoration: "none", ml: 0.5 }}
                component={Link}
                href={"#"}
                variant="caption"
                color="text.secondary"
              >
                email@example.info
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Footer;

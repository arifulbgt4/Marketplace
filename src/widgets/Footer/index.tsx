"use client";
import { FC } from "react";
import { Container, Grid, Stack, Typography, Link } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/LocalPhone";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";

import routes from "src/global/routes";
import Logo from "src/components/Logo";
import { useStorefrontSettings } from "src/contexts/StorefrontSettings";

import { FooterProps } from "./Types";

const Footer: FC<FooterProps> = () => {
  const settings = useStorefrontSettings();
  const socialLinks = settings?.branding.socialLinks ?? {};
  return (
    <Container
      sx={(theme) => ({
        background: theme.palette.background.default,
        mt: 7.5,
        mb: { xs: 8, md: 0 },
      })}
    >
      <Grid container>
        <Grid
          item
          xs={12}
          container
          spacing={2.5}
          pt={5}
          pb={4}
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
              {socialLinks.youtube ? (
                <Link
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <YouTubeIcon
                  sx={(theme) => ({
                    width: 22,
                    height: 22,
                    color: theme.palette.text.primary,
                  })}
                  />
                </Link>
              ) : null}
              {socialLinks.facebook ? (
                <Link
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                <FacebookRoundedIcon
                  sx={(theme) => ({
                    width: 22,
                    height: 22,
                    color: theme.palette.text.primary,
                  })}
                  />
                </Link>
              ) : null}
              {socialLinks.instagram ? (
                <Link
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                <InstagramIcon
                  sx={(theme) => ({
                    width: 22,
                    height: 22,
                    color: theme.palette.text.primary,
                  })}
                  />
                </Link>
              ) : null}
              {socialLinks.linkedin ? (
                <Link
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                <LinkedInIcon
                  sx={(theme) => ({
                    width: 22,
                    height: 22,
                    color: theme.palette.text.primary,
                  })}
                  />
                </Link>
              ) : null}
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
                © {new Date().getFullYear()}{" "}
                {settings?.business.displayName ?? "Marketplace"}
              </Typography>
              <Stack flexDirection="row" ml={2} gap={2}>
                <Typography
                  sx={{ textDecoration: "none" }}
                  component={Link}
                  href={routes.terms}
                  variant="caption"
                  color="text.secondary"
                >
                  Terms
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
            {settings?.business.supportPhone ? (
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
                href={`tel:${settings.business.supportPhone}`}
                variant="caption"
                color="text.secondary"
              >
                {settings.business.supportPhone}
              </Typography>
              </Stack>
            ) : null}
            {settings?.business.supportEmail ? (
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
                href={`mailto:${settings.business.supportEmail}`}
                variant="caption"
                color="text.secondary"
              >
                {settings.business.supportEmail}
              </Typography>
              </Stack>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Footer;

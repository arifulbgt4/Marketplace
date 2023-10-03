"use client";
import { FC } from "react";
import { Stack, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import { SocialIconLinkProps } from "./Types";

const SocialIconLink: FC<SocialIconLinkProps> = () => {
  return (
    <Stack direction="row">
      <Typography>
        <TwitterIcon />
      </Typography>
      <Typography>
        <FacebookIcon />
      </Typography>
      <Typography>
        <InstagramIcon />
      </Typography>
      <Typography>
        <LinkedInIcon />
      </Typography>
    </Stack>
  );
};

export default SocialIconLink;

"use client";
import { FC } from "react";
import { Stack, Link, Box } from "@mui/material";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import { SocialLinkProps } from "./Types";

const SocialIconLink: FC<SocialLinkProps> = () => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="end" gap={5}>
      <Link href="#" target="_blank">
        <TwitterIcon sx={{ width: 32, height: 32 }} />
      </Link>
      <Link href="#" target="_blank">
        <FacebookRoundedIcon sx={{ width: 32, height: 32 }} />
      </Link>
      <Link href="#" target="_blank">
        <InstagramIcon sx={{ width: 32, height: 32 }} />
      </Link>
      <Link href="#" target="_blank">
        <LinkedInIcon sx={{ width: 32, height: 32 }} />
      </Link>
    </Stack>
  );
};

export default SocialIconLink;

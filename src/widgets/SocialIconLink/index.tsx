"use client";
import { FC } from "react";
import { Stack, Typography, Paper, Link } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import { SocialIconLinkProps } from "./Types";

const SocialIconLink: FC<SocialIconLinkProps> = () => {
  return (
    <Paper>
      <Stack direction="row">
        <Link href="#">
          <Typography>
            <TwitterIcon />
          </Typography>
        </Link>
        <Link href="#">
          <Typography>
            <FacebookIcon />
          </Typography>
        </Link>
        <Link href="#">
          <Typography>
            <InstagramIcon />
          </Typography>
        </Link>
        <Link href="#">
          <Typography>
            <LinkedInIcon />
          </Typography>
        </Link>
      </Stack>
    </Paper>
  );
};

export default SocialIconLink;

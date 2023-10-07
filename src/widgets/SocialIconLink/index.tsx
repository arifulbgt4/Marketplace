"use client";
import { FC } from "react";
import { Stack, Typography, Paper, Link, Box } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import { SocialIconLinkProps } from "./Types";

const linksicon = [
  { icon: <TwitterIcon sx={{ width: 32, height: 26 }} />, link: "#" },
  { icon: <FacebookIcon sx={{ width: 32, height: 26 }} />, link: "#" },
  { icon: <InstagramIcon sx={{ width: 32, height: 26 }} />, link: "#" },
  { icon: <LinkedInIcon sx={{ width: 32, height: 26 }} />, link: "#" },
];

const SocialIconLink: FC<SocialIconLinkProps> = () => {
  return (
    <Paper>
      <Stack direction="row" gap={5}>
        {linksicon.map((data) => {
          const { link, icon } = data;
          return (
            <Box component={Link} href={link}>
              <Typography>{icon}</Typography>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default SocialIconLink;

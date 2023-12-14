"use client";
import { FC } from "react";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Link, Stack } from "@mui/material";

import { ContactHelpInfoPrps } from "./Types";

const ContactHelpInfo: FC<ContactHelpInfoPrps> = () => {
  return (
    <Stack alignItems="center" justifyContent="flex-end" pb={5}>
      <Stack
        gap={2}
        px={2.5}
        py={3}
        bgcolor="primary.main"
        flexDirection={{ xs: "row", md: "column" }}
        sx={{
          borderTopRightRadius: { md: 8 },
          borderBottomRightRadius: { xs: 20, md: 24 },
          borderBottomLeftRadius: { xs: 20, md: 0 },
        }}
        width="100%"
        justifyContent="space-around"
      >
        <Link href="#" target="_blank">
          <TwitterIcon
            sx={(theme) => ({
              width: 32,
              height: 32,
              color: theme.palette.common.white,
            })}
          />
        </Link>
        <Link href="#" target="_blank">
          <FacebookRoundedIcon
            sx={(theme) => ({
              width: 32,
              height: 32,
              color: theme.palette.common.white,
            })}
          />
        </Link>
        <Link href="#" target="_blank">
          <InstagramIcon
            sx={(theme) => ({
              width: 32,
              height: 32,
              color: theme.palette.common.white,
            })}
          />
        </Link>
        <Link href="#" target="_blank">
          <LinkedInIcon
            sx={(theme) => ({
              width: 32,
              height: 32,
              color: theme.palette.common.white,
            })}
          />
        </Link>
      </Stack>
    </Stack>
  );
};

export default ContactHelpInfo;

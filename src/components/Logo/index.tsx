import { FC } from "react";
import { Stack, Box, Typography, SvgIcon, Link } from "@mui/material";

import routes from "src/global/routes";

import { LogoProps } from "./Types";

const Logo: FC<LogoProps> = () => {
  return (
    <Stack
      alignItems="center"
      flexGrow={1}
      direction="row"
      component={Link}
      href={routes.home}
      underline="none"
    >
      <Box component={SvgIcon} alignItems="center" mr={2}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="20" fill="#42A5F5" />
          <path
            d="M9.574 32V7.86H18.856C21.5307 7.86 23.7633 8.404 25.554 9.492C27.3673 10.5573 28.7273 12.008 29.634 13.844C30.5633 15.6573 31.028 17.6747 31.028 19.896C31.028 22.344 30.518 24.4747 29.498 26.288C28.5007 28.1013 27.084 29.5067 25.248 30.504C23.4347 31.5013 21.304 32 18.856 32H9.574ZM24.296 19.896C24.296 18.6493 24.0807 17.5613 23.65 16.632C23.2193 15.68 22.596 14.9433 21.78 14.422C20.964 13.9007 19.9893 13.64 18.856 13.64H16.204V26.22H18.856C20.012 26.22 20.9867 25.948 21.78 25.404C22.596 24.86 23.2193 24.112 23.65 23.16C24.0807 22.1853 24.296 21.0973 24.296 19.896Z"
            fill="black"
            fill-opacity="0.87"
          />
        </svg>
      </Box>
      <Typography
        variant="h6"
        noWrap
        sx={{
          mr: 2,
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".3rem",
          color: "inherit",
          textDecoration: "none",
        }}
      >
        DREAM HOUSE
      </Typography>
    </Stack>
  );
};

export default Logo;

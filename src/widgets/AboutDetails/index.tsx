import { FC } from "react";
import { Paper, Stack, Typography } from "@mui/material";

import { AboutContentsProps } from "./Types";

const AboutContents: FC<AboutContentsProps> = () => {
  return (
    <Paper elevation={0}>
      <Stack
        p={{ xs: 2, md: 4 }}
        alignItems="flex-start"
        gap={{ xs: 2, md: 4 }}
      >
        <Typography variant="h4">What is Dream House?</Typography>
        <Stack gap={2} alignItems="flex-start">
          <Typography>
            Lorem ipsum dolor sit amet consectetur. Venenatis mauris purus
            ornare porta id malesuada nibh vestibulum morbi. Quam blandit
            scelerisque duis nunc erat lectus feugiat fames massa. Velit cursus
            faucibus venenatis vitae integer massa blandit. Ut vitae arcu
            suscipit egestas ultrices.
          </Typography>
          <Typography>
            Lorem ipsum dolor sit amet consectetur. Venenatis mauris purus
            ornare porta id malesuada nibh vestibulum morbi. Quam blandit
            scelerisque duis nunc erat lectus feugiat fames massa. Velit cursus
            faucibus venenatis vitae integer massa blandit. Ut vitae arcu
            suscipit egestas ultrices.
          </Typography>
          <Typography>
            Lorem ipsum dolor sit amet consectetur. Venenatis mauris purus
            ornare porta id malesuada nibh vestibulum morbi. Quam blandit
            scelerisque duis nunc erat lectus feugiat fames massa. Velit cursus
            faucibus venenatis vitae integer massa blandit. Ut vitae arcu
            suscipit egestas ultrices.
          </Typography>
          <Typography>
            Lorem ipsum dolor sit amet consectetur. Venenatis mauris purus
            ornare porta id malesuada nibh vestibulum morbi. Quam blandit
            scelerisque duis nunc erat lectus feugiat fames massa. Velit cursus
            faucibus venenatis vitae integer massa blandit. Ut vitae arcu
            suscipit egestas ultrices.
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default AboutContents;

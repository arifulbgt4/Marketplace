import { Paper, Stack, Typography } from "@mui/material";
import { FC } from "react";

import { AboutDetailsProps } from "./Types";

const AboutDetails: FC<AboutDetailsProps> = () => {
  return (
    <Paper>
      <Stack p={5} alignItems="flex-start" gap={4}>
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

export default AboutDetails;

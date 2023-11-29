import { FC } from "react";
import {
  Box,
  CardMedia,
  Grid,
  Stack,
  Typography,
  Container,
} from "@mui/material";

import { AboutDetailsProps } from "./Types";

const AboutDetails: FC<AboutDetailsProps> = () => {
  return (
    <Box>
      <Container>
        <Grid container rowSpacing={7}>
          <Grid item xs={12}>
            <Stack justifyContent="center" alignItems="center">
              <Typography variant="h6">WHO ARE WE</Typography>
              <Typography variant="h2">ABOUT US</Typography>
            </Stack>
          </Grid>
          <Grid
            item
            container
            xs={12}
            justifyContent="flex-end"
            display="flex"
            position="relative"
          >
            <Grid item xs={5.5}>
              <CardMedia
                height={560}
                component="img"
                image="https://img.freepik.com/premium-photo/cooperation-action-group-young-modern-men-formalwear-working-using-computers-while-sitting-office_425904-830.jpg?w=1060"
              />
            </Grid>
            <Grid item xs={8} position="absolute" bottom={260} left={0}>
              <Stack>
                <Typography variant="h4">
                  Lorem ipsum dolor sit amet consectetur. Venenatis mauris purus
                  ornare porta id malesuada nibh vestibulum morbi. Quam blandit
                  scelerisque duis nunc erat lectus feugiat fames massa. Velit
                  cursus faucibus venenatis vitae integer massa blandit. Ut
                  vitae arcu suscipit egestas ultrices.
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutDetails;

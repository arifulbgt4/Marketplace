"use client";
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
            justifyContent={{ md: "flex-end" }}
            display="flex"
            position="relative"
            flexDirection={{ md: "row" }}
            spacing={2}
          >
            <Grid
              item
              xs={12}
              md={7.5}
              position={{ md: "absolute" }}
              left={{ md: 0 }}
              top={{ md: 260 }}
            >
              <Box
                sx={(theme) => ({
                  background: theme.palette.background.default,
                  opacity: 0.7,
                  borderRadius: 1,
                })}
              >
                <Box
                  component="blockquote"
                  position="relative"
                  textAlign={{ xs: "center", md: "initial" }}
                >
                  <Box
                    sx={{ transform: "Rotate(200deg)" }}
                    position="absolute"
                    left={-8}
                    top={-50}
                  >
                    <Typography color="warning.main" variant="h1">
                      "
                    </Typography>
                  </Box>
                  <Typography variant="h4">
                    Lorem ipsum dolor sit amet consectetur. Venenatis mauris
                    purus ornare porta id malesuada nibh vestibulum morbi. Quam
                    blandit scelerisque duis nunc erat lectus feugiat fames
                    massa. Velit cursus faucibus venenatis vitae integer massa
                    blandit. Ut vitae arcu suscipit egestas ultrices.
                  </Typography>
                  <Box
                    sx={{ transform: "Rotate(15deg)" }}
                    position="absolute"
                    left={90}
                    top={143}
                  >
                    <Typography color="warning.main" variant="h1">
                      "
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={5.5}>
              <Box bgcolor=" linear-gradient(180deg, red, yellow)">
                <CardMedia
                  sx={{ height: { md: 560, xs: 300 } }}
                  component="img"
                  image="https://img.freepik.com/premium-photo/cooperation-action-group-young-modern-men-formalwear-working-using-computers-while-sitting-office_425904-830.jpg?w=1060"
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutDetails;

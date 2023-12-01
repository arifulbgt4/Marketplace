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
              <Typography
                variant="h4"
                textAlign={{ xs: "center", md: "initial" }}
              >
                Lorem ipsum dolor sit amet consectetur. Venenatis mauris purus
                ornare porta id malesuada nibh vestibulum morbi. Quam blandit
                scelerisque duis nunc erat lectus feugiat fames massa. Velit
                cursus faucibus venenatis vitae integer massa blandit. Ut vitae
                arcu suscipit egestas ultrices.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5.5}>
              <CardMedia
                sx={{ opacity: 0.7, height: { md: 560, xs: 300 } }}
                component="img"
                image="https://img.freepik.com/premium-photo/cooperation-action-group-young-modern-men-formalwear-working-using-computers-while-sitting-office_425904-830.jpg?w=1060"
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutDetails;

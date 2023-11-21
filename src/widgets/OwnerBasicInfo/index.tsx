import { FC } from "react";
import { Grid, Stack, Typography } from "@mui/material";

import { OwnerBasicInfoPrps } from "./Types";

const OwnerBasicInfo: FC<OwnerBasicInfoPrps> = () => {
  return (
    <Stack gap={3}>
      <Typography variant="h5">Basic Information</Typography>
      <Grid container rowSpacing={2}>
        <Grid container item xs={12} rowSpacing={1}>
          <Grid item container xs={12} md={3}>
            <Grid item xs={5} md={12}>
              <Typography variant="subtitle1" color="text.secondary">
                User Name
              </Typography>
            </Grid>
            <Grid item xs={7} md={12}>
              <Typography variant="h6">williamjhon </Typography>
            </Grid>
          </Grid>
          <Grid item container md={9} xs={12}>
            <Grid item xs={5} md={12}>
              <Typography color="text.secondary">Address</Typography>
            </Grid>
            <Grid item xs={7} md={12}>
              <Typography variant="h6">
                3891 Ranchview Dr. Richardson,California 62639
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={12} rowSpacing={1}>
          <Grid item container xs={12} md={3}>
            <Grid item xs={5} md={12}>
              <Typography color="text.secondary">Phone Number</Typography>
            </Grid>
            <Grid item xs={7} md={12}>
              <Typography variant="h6">(303) 555-0105</Typography>
            </Grid>
          </Grid>
          <Grid item container xs={12} md={3}>
            <Grid item xs={5} md={12}>
              <Typography color="text.secondary">Email Address</Typography>
            </Grid>
            <Grid item xs={7} md={12}>
              <Typography variant="h6">kenzi.lawson@example.com</Typography>
            </Grid>
          </Grid>
          <Grid item container xs={12} md={3}>
            <Grid
              item
              md={12}
              xs={5}
              display="flex"
              justifyContent={{ md: "center" }}
            >
              <Typography color="text.secondary">Age</Typography>
            </Grid>
            <Grid
              item
              md={12}
              xs={7}
              display="flex"
              justifyContent={{ md: "center" }}
            >
              <Typography variant="h6">42</Typography>
            </Grid>
          </Grid>
          <Grid item container xs={12} md={3}>
            <Grid item xs={5} md={12}>
              <Typography color="text.secondary">Gender</Typography>
            </Grid>
            <Grid item xs={7} md={12}>
              <Typography variant="h6">Male</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default OwnerBasicInfo;

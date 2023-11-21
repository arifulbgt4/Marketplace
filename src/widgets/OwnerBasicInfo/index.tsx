import { FC } from "react";
import { Grid, Stack, Typography } from "@mui/material";

import { OwnerBasicInfoPrps } from "./Types";

const OwnerBasicInfo: FC<OwnerBasicInfoPrps> = () => {
  return (
    <Stack gap={3}>
      <Typography variant="h5">Basic Information</Typography>
      <Grid container rowSpacing={4}>
        <Grid container item xs={12}>
          <Grid item xs={3}>
            <Typography variant="subtitle1" color="text.secondary">
              User Name
            </Typography>
            <Typography variant="h6">williamjhon </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography color="text.secondary">Address</Typography>
            <Typography variant="h6">
              3891 Ranchview Dr. Richardson,California 62639
            </Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={3}>
            <Typography color="text.secondary">Phone Number</Typography>
            <Typography variant="h6">(303) 555-0105</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography color="text.secondary">Email Address</Typography>
            <Typography variant="h6">kenzi.lawson@example.com</Typography>
          </Grid>
          <Grid
            item
            xs={3}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography color="text.secondary">Age</Typography>
            <Typography variant="h6">42</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography color="text.secondary">Gender</Typography>
            <Typography variant="h6">Male</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default OwnerBasicInfo;

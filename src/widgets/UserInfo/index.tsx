import { FC } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";

import { UserDetailsProps } from "./Types";

const UserInfo: FC<UserDetailsProps> = () => {
  return (
    <Paper>
      <Box p={5}>
        <Grid container rowGap={2.5}>
          <Grid item xs={4}>
            <Typography variant="h6">First Name</Typography>
          </Grid>
          <Grid item xs={8}>
            <Box display="flex" gap={2.5} color="text.disabled">
              <Typography variant="subtitle1">:</Typography>
              <Typography variant="subtitle1">Jueal</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Last Name</Typography>
          </Grid>
          <Grid item xs={8}>
            <Box display="flex" gap={2.5} color="text.disabled">
              <Typography variant="subtitle1">:</Typography>
              <Typography variant="subtitle1">Hassan</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">User Name</Typography>
          </Grid>
          <Grid item xs={8}>
            <Box display="flex" gap={2.5} color="text.disabled">
              <Typography variant="subtitle1">:</Typography>
              <Typography variant="subtitle1">Jueal JN</Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="h6">Address</Typography>
          </Grid>
          <Grid item xs={8}>
            <Box display="flex" gap={2.5} color="text.disabled">
              <Typography variant="subtitle1">:</Typography>
              <Typography variant="subtitle1">
                3891 Ranchview Dr. Richardson,California 62639
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Email Address</Typography>
          </Grid>
          <Grid item xs={8}>
            <Box display="flex" gap={2.5} color="text.disabled">
              <Typography variant="subtitle1">:</Typography>
              <Typography variant="subtitle1">
                mdjueal920977@gmail.com
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Phone Number</Typography>
          </Grid>
          <Grid item xs={8}>
            <Box display="flex" gap={2.5} color="text.disabled">
              <Typography variant="subtitle1">:</Typography>
              <Typography variant="subtitle1">01753558014</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Age</Typography>
          </Grid>
          <Grid item xs={8}>
            <Box display="flex" gap={2.5} color="text.disabled">
              <Typography variant="subtitle1">:</Typography>
              <Typography variant="subtitle1">23</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">Gender</Typography>
          </Grid>
          <Grid item xs={8}>
            <Box display="flex" gap={2.5} color="text.disabled">
              <Typography variant="subtitle1">:</Typography>
              <Typography variant="subtitle1">Male</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default UserInfo;

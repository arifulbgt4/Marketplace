import { FC } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";

import { ItemProps, AccountDetailsProps } from "./Types";

const AccountDetails: FC<AccountDetailsProps> = () => {
  return (
    <Box sx={{ p: { md: 5 } }}>
      <Grid container rowGap={3}>
        <Item property="First Name" value="Jueal" />
        <Item property="Last Name" value="Hassan" />
        <Item property="First Name" value="Jueal" />
        <Item property="User Name" value="Jueal JN" />
        <Item
          property="Address"
          value=" 3891 Ranchview Dr. Richardson,California 62639"
        />
        <Item property="Email Address" value="mdjueal920977@gmail.com" />
        <Item property="Phone Number" value="Jueal JN" />
        <Item property="Age" value="23" />
        <Item property="Gender" value="Male" />
      </Grid>
    </Box>
  );
};

export default AccountDetails;

const Item: FC<ItemProps> = ({ property, value }) => {
  return (
    <>
      <Grid item xs={4}>
        <Typography variant="h6">{property}</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography variant="subtitle1">:</Typography>
      </Grid>
      <Grid item container xs={7} justifyContent="flex-end" display="flex">
        <Grid item xs={12}>
          <Typography variant="subtitle1">{value}</Typography>
        </Grid>
      </Grid>
    </>
  );
};

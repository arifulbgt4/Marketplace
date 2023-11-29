import { FC } from "react";
import { Paper, Stack, Typography, CardMedia, Box, Grid } from "@mui/material";

import { AboutContentsProps } from "./Types";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const CompanyDetails: FC<AboutContentsProps> = () => {
  return (
    <Grid container display="flex" justifyContent="flex-end">
      <Grid
        item
        xs={6}
        position="absolute"
        top={100}
        left={130}
        border={(theme) => `8px solid ${theme.palette.background.default}`}
        borderRadius={3}
      >
        <CardMedia
          component="img"
          height={608}
          src="https://plus.unsplash.com/premium_photo-1682141322027-3fa79a082524?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      </Grid>
      <Grid
        item
        xs={8}
        py={25}
        bgcolor="background.paper"
        container
        borderTop={(theme) => `4px solid ${theme.palette.divider}`}
      >
        <Grid item xs={5.5}></Grid>
        <Grid item xs={6} justifyContent="flex-end">
          <Stack direction="column" alignItems="start" columnGap={7.5}>
            <Stack direction="column" gap={3}>
              <Typography variant="h6">DISCOVER MISSION AND VALUES</Typography>
              <Typography variant="h3">OUR COMPANY</Typography>
              <Typography variant="subtitle1">
                We are one of the leading life insurance companies offering a
                range of individual and group insurance solutions that meet
                various customer needs such as Protection, Pension, Savings &
                Investment and Health, along with Children's and Women's Plan.
              </Typography>
            </Stack>
            <Stack direction="column" gap={3}>
              <Stack direction="column" gap={1.5}>
                <Typography variant="h4">
                  01 Safety First, Not Sales:
                </Typography>
                <Typography variant="subtitle1">
                  experienced discounts, new home and loyalty discounts. that's
                  just the beginning.
                </Typography>
              </Stack>
              <Stack direction="column" gap={1.5}>
                <Typography variant="h4">02 Protecting Your Budget:</Typography>
                <Typography variant="subtitle1">
                  experienced discounts, new home and loyalty discounts. that's
                  just the beginning.
                </Typography>
              </Stack>
              <Stack direction="column" gap={1.5}>
                <Typography variant="h4">03 High Quality Insurance:</Typography>
                <Typography variant="subtitle1">
                  Our success comes from doing what's right for our customers
                  and our employees.
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CompanyDetails;

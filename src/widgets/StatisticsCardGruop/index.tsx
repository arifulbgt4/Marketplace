import { FC } from "react";
import { Grid } from "@mui/material";

import { StatisticsCardGroupProps } from "./Types";
import StatisticsCard from "../StatisticsCard";

const StatisticsCardGroup: FC<StatisticsCardGroupProps> = () => {
  return (
    <Grid container>
      <Grid item xs={4}>
        <StatisticsCard />
      </Grid>
      <Grid item xs={4}>
        <StatisticsCard />
      </Grid>
      <Grid item xs={4}>
        <StatisticsCard />
      </Grid>
    </Grid>
  );
};

export default StatisticsCardGroup;

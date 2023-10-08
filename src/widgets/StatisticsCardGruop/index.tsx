import { FC } from "react";
import { Grid } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";

import StatisticsCard from "../StatisticsCard";

import { StatisticsCardGroupProps } from "./Types";

const staticCardData = [
  {
    id: 1,
    title: "My Inquiries",
    icon: <CheckCircleOutlineIcon sx={{ height: 20, width: 20 }} />,
  },
  {
    id: 1,
    title: "Favourites",
    icon: <FavoriteIcon sx={{ height: 20, width: 20 }} />,
  },
  {
    id: 1,
    title: "Recommended",
    icon: <StarIcon sx={{ height: 20, width: 20 }} />,
  },
];

const StatisticsCardGroup: FC<StatisticsCardGroupProps> = () => {
  return (
    <Grid container columnSpacing={2}>
      {staticCardData.map((data) => {
        const { id, title, icon } = data;
        return (
          <Grid key={id} item xs={4}>
            <StatisticsCard id={id} icon={icon} title={title} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatisticsCardGroup;

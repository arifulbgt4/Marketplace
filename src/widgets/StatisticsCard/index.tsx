import { FC } from "react";
import {
  Card,
  CardActions,
  CardHeader,
  Button,
  IconButton,
} from "@mui/material";

import { StatisticsCardProps } from "./Types";

const StatisticsCard: FC<StatisticsCardProps> = ({ id, title, icon }) => {
  return (
    <Card>
      <CardHeader
        title={title}
        action={<IconButton>{icon}</IconButton>}
      ></CardHeader>
      <CardActions>
        <Button>view all</Button>
        <Button>hide</Button>
      </CardActions>
    </Card>
  );
};

export default StatisticsCard;

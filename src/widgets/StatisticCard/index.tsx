import { FC } from "react";
import {
  Card,
  CardActions,
  CardHeader,
  Button,
  IconButton,
} from "@mui/material";

import { StatisticCardProps } from "./Types";

const StatisticCard: FC<StatisticCardProps> = ({ id, title, icon }) => {
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

export default StatisticCard;

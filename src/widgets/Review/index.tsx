import { FC } from "react";

import { ReviewProps } from "./Types";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Review: FC<ReviewProps> = ({
  id,
  title,
  subheader,
  img,
  description,
  action,
}) => {
  return (
    <Card elevation={0}>
      <CardHeader
        avatar={<Avatar variant="rounded" src={img} />}
        title={title}
        subheader={subheader}
      />
      {description && (
        <CardContent>
          <Typography variant="subtitle1">{description}</Typography>
        </CardContent>
      )}
      {action && (
        <CardActions>
          <Button
            size="large"
            color="inherit"
            endIcon={<ArrowForwardIosIcon />}
          >
            {action}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default Review;

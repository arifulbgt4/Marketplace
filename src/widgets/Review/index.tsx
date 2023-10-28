import { FC } from "react";

import { ReviewProps } from "./Types";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";

const Review: FC<ReviewProps> = ({
  id,
  title,
  subheader,
  img,
  description,
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
    </Card>
  );
};

export default Review;

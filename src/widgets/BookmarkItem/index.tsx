import { FC } from "react";
import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import { BookmarkItemProps } from "./Types";

const BookmarkItem: FC<BookmarkItemProps> = ({
  title,
  subheader,
  bedroom,
  bathroom,
  rent,
}) => {
  return (
    <Card>
      <CardHeader
        title={title}
        subheader={subheader}
        avatar={<Avatar>OP</Avatar>}
      />
      <CardContent>
        <Box px={2} py={0.5}>
          <Typography variant="body2">Bedrooms: {bedroom}</Typography>
        </Box>
        <Box px={2} py={0.5}>
          <Typography variant="body2">Bathrooms: {bathroom}</Typography>
        </Box>
        <Box px={2} py={0.5}>
          <Typography variant="body2">Rent from : $ {rent}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookmarkItem;

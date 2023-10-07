import { FC } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

import { ListingProps } from "./Types";

const Listing: FC<ListingProps> = () => {
  return (
    <Card>
      <CardMedia component="img" sx={{ height: "240px" }} />
      <CardContent>
        <Typography variant="h5">Header</Typography>
        <Typography variant="body2">instance slot</Typography>
      </CardContent>
      <CardActions>
        <Button>card action</Button>
        <Button>card action</Button>
      </CardActions>
    </Card>
  );
};

export default Listing;

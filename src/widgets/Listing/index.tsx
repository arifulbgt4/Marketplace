import { FC } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Link,
} from "@mui/material";

import { ListingProps } from "./Types";

const Listing: FC<ListingProps> = ({
  id,
  slug,
  title,
  image,
  price,
  description,
  rating,
}) => {
  return (
    <Card>
      <CardMedia component="img" sx={{ height: "240px" }} src={image} />
      <CardContent>
        <Typography variant="h5" component={Link} href={`/l/${slug}`}>
          ${price}/{title}
        </Typography>
        <Typography variant="body2">{description}</Typography>
        <Rating
          name="read-only"
          defaultValue={rating}
          precision={0.1}
          readOnly
        />
      </CardContent>
      <CardActions>
        <Button>card action</Button>
        <Button>card action</Button>
      </CardActions>
    </Card>
  );
};

export default Listing;

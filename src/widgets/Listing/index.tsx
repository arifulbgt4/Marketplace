import { FC } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  Link,
  Stack,
  Box,
  IconButton,
  Grid,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import DeselectIcon from "@mui/icons-material/Deselect";
import ApartmentIcon from "@mui/icons-material/Apartment";

import routes from "src/global/routes";

import { ListingProps } from "./Types";

const Listing: FC<ListingProps> = ({
  id,
  slug,
  title,
  image,
  price,
  description,
  rating,
  address,
}) => {
  return (
    <Card elevation={2}>
      <CardMedia component="img" height={240} src={image} />
      <CardHeader title={title} subheader={address}></CardHeader>
      <CardContent>
        <Grid container>
          <Grid item xs={6}>
            <Stack flexDirection="row" alignItems="center">
              <IconButton>
                <BedIcon fontSize="small" />
              </IconButton>
              <Typography color="text.secondary" variant="subtitle1">
                1-2 Beds
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack flexDirection="row" alignItems="center">
              <IconButton>
                <BathtubIcon fontSize="small" />
              </IconButton>

              <Typography color="text.secondary" variant="subtitle1">
                0-1 Bath
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack flexDirection="row" alignItems="center">
              <IconButton>
                <DeselectIcon fontSize="small" />
              </IconButton>
              <Typography color="text.secondary" variant="subtitle1">
                634 - 940 Sqft
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack flexDirection="row" alignItems="center">
              <IconButton>
                <ApartmentIcon fontSize="small" />
              </IconButton>
              <Typography color="text.secondary" variant="subtitle1">
                1-2 Apartment
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Stack flexDirection="row" justifyContent="space-between" flex={1}>
          <Typography variant="h5">{price}/mo</Typography>
          <Button
            variant="outlined"
            component={Link}
            href={`${routes.listingDetails}/${slug}`}
          >
            view details
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default Listing;

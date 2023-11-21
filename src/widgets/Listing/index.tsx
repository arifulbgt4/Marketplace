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
  isGrid = true,
  id,
  slug,
  title,
  image,
  price,
  description,
  rating,
  address,
  services,
}) => {
  return (
    <Card
      elevation={1}
      sx={{
        display: "flex",
        flexDirection: isGrid ? "column" : "row",
        gap: isGrid ? 0 : 3,
      }}
    >
      <CardMedia component="img" height={isGrid ? 260 : 290} src={image} />
      <Stack p={isGrid ? 0 : 1} width="100%" justifyContent="space-between">
        <CardHeader title={title} subheader={address} />
        {services && (
          <CardContent>
            <Grid container>
              <Grid item xs={6}>
                <Stack flexDirection="row" alignItems="center">
                  <IconButton>
                    <BedIcon fontSize="small" />
                  </IconButton>
                  <Typography color="text.secondary" variant="subtitle1">
                    {services?.bed} Beds
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <IconButton>
                    <BathtubIcon fontSize="small" />
                  </IconButton>
                  <Typography color="text.secondary" variant="subtitle1">
                    {services?.bath} Bath
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack flexDirection="row" alignItems="center">
                  <IconButton>
                    <DeselectIcon fontSize="small" />
                  </IconButton>
                  <Typography color="text.secondary" variant="subtitle1">
                    {services?.area} Sqft
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <IconButton>
                    <ApartmentIcon fontSize="small" />
                  </IconButton>
                  <Typography color="text.secondary" variant="subtitle1">
                    {services?.apartment} Apartment
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        )}
      </Stack>
      {price && (
        <CardActions>
          <Stack
            height="100%"
            flexDirection={isGrid ? "row" : "column"}
            justifyContent="space-between"
            flex={1}
            padding={isGrid ? 0 : 2}
            pb={isGrid ? 0 : 3}
          >
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
      )}
    </Card>
  );
};

export default Listing;

"use client";
import { FC, useState } from "react";
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
  Box,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import DeselectIcon from "@mui/icons-material/Deselect";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";

import routes from "src/global/routes";

import { ListingProps } from "./Types";

const Listing: FC<ListingProps> = ({
  isGrid = true,
  isMark = false,
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
  const [isSelect, setIsSelect] = useState(isMark);
  return (
    <Card
      elevation={1}
      sx={{
        display: "flex",
        flexDirection: isGrid ? "column" : "row",
        gap: isGrid ? 0 : 3,
        position: "relative",
      }}
    >
      <Box component={Link} href={`${routes.listingDetails}/${slug}`}>
        <CardMedia component="img" height={isGrid ? 250 : 223} src={image} />
      </Box>
      <IconButton
        onClick={() => {
          setIsSelect((prv) => !prv);
        }}
        sx={{ position: "absolute", top: 8, right: 8 }}
        size="large"
      >
        {isSelect ? (
          <BookmarkIcon color="primary" />
        ) : (
          <BookmarkBorderOutlinedIcon color="primary" />
        )}
      </IconButton>
      <Stack p={isGrid ? 0 : 1} width="100%" justifyContent="space-between">
        <CardHeader
          title={
            <Box
              component={Link}
              color="text.primary"
              href={`${routes.listingDetails}/${slug}`}
              sx={{
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              <Typography variant="h5">{title}</Typography>
            </Box>
          }
          subheader={
            <Box pt={0.5}>
              <Typography variant="h6">{address}</Typography>
            </Box>
          }
        />
        {services && (
          <CardContent>
            <Grid container rowSpacing={2}>
              <Grid item xs={6}>
                <Stack flexDirection="row" gap={2} alignItems="center">
                  <IconButton>
                    <BedIcon fontSize="small" />
                  </IconButton>
                  <Typography color="text.secondary" variant="subtitle2">
                    {services?.bed} Beds
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack
                  flexDirection="row"
                  gap={2}
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <IconButton>
                    <BathtubIcon fontSize="small" />
                  </IconButton>
                  <Typography color="text.secondary" variant="subtitle2">
                    {services?.bath} Bath
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack flexDirection="row" gap={2} alignItems="center">
                  <IconButton>
                    <DeselectIcon fontSize="small" />
                  </IconButton>
                  <Typography color="text.secondary" variant="subtitle2">
                    {services?.area} Sqft
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack
                  flexDirection="row"
                  gap={2}
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <IconButton>
                    <ApartmentIcon fontSize="small" />
                  </IconButton>
                  <Typography color="text.secondary" variant="subtitle2">
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

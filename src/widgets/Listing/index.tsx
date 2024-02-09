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
  Avatar,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import DeselectIcon from "@mui/icons-material/Deselect";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import CategoryIcon from "@mui/icons-material/Category";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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
  name,
}) => {
  const [isSelect, setIsSelect] = useState(isMark);
  const [show, setShow] = useState(false);

  return (
    <Stack
      // elevation={0}
      sx={{
        display: "flex",
        flexDirection: isGrid ? "column" : "row",
        gap: isGrid ? 0 : 3,
        position: "relative",
        borderRadius: 4.5,
        bgcolor: "transparent",
        ":hover": {
          boxShadow: 10,
        },
      }}
      onMouseOver={() => setShow(true)}
      onMouseOut={() => setShow(false)}
    >
      <Box component={Link} href={`${routes.listingDetails}/${slug}`}>
        <CardMedia
          sx={{
            borderRadius: 3,
            // borderBottomLeftRadius: !show ? 18 : 0,
            // borderBottomRightRadius: !show ? 18 : 0,
          }}
          image={image}
        >
          <Stack height={isGrid ? 250 : 223} overflow="hidden">
            {show && (
              <Stack
                p={2}
                justifyContent="space-between"
                alignItems="end"
                flexDirection="row"
                sx={(theme) => ({
                  background: `linear-gradient(to top, ${theme.palette.action.active} 20%, transparent 40%)`,
                  overflow: "hidden",
                })}
                borderRadius={3}
                height="100%"
              >
                <Typography pb={0.5} variant="h5" color="#fff">
                  {title}
                </Typography>
                <IconButton
                  sx={(theme) => ({
                    bgcolor: theme.palette.background.default,
                    ":hover": { bgcolor: theme.palette.background.default },
                  })}
                  onClick={() => {
                    setIsSelect((prv) => !prv);
                  }}
                  size="large"
                >
                  {isSelect ? (
                    <BookmarkIcon
                      sx={{ height: 18, width: 18 }}
                      color="primary"
                    />
                  ) : (
                    <BookmarkBorderOutlinedIcon
                      sx={{ height: 18, width: 18 }}
                      color="primary"
                    />
                  )}
                </IconButton>
              </Stack>
            )}
          </Stack>
        </CardMedia>
      </Box>
      <Stack flexDirection="row" p={2} justifyContent="space-between">
        <Stack
          flexDirection="row"
          alignItems="center"
          gap={1}
          component={Link}
          color="text.primary"
          href={`${routes.listingDetails}/${slug}`}
          sx={{
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          <LocationOnIcon fontSize="small" />

          <Typography variant="h6">{address.slice(0, 24)}</Typography>
        </Stack>
        <Stack
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          gap={0.5}
          color="text.secondary"
        >
          <CategoryIcon sx={{ height: 18, width: 18 }} />
          <Typography fontWeight={600} variant="caption">
            2.5
          </Typography>
        </Stack>
        {/* {services && (
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
        )} */}
      </Stack>
      {/* {price && (
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
      )} */}
    </Stack>
  );
};

export default Listing;

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
    <Card
      elevation={24}
      sx={{
        display: "flex",
        flexDirection: isGrid ? "column" : "row",
        gap: isGrid ? 0 : 3,
        position: "relative",
        borderRadius: 3,
        bgcolor: "transparent",
      }}
    >
      <Box component={Link} href={`${routes.listingDetails}/${slug}`}>
        <CardMedia
          image={image}
          onMouseOver={() => setShow(true)}
          onMouseOut={() => setShow(false)}
        >
          <Stack height={isGrid ? 250 : 223}>
            {show && (
              <Stack
                px={1}
                pb={2}
                justifyContent="space-between"
                alignItems="end"
                flexDirection="row"
                sx={(theme) => ({
                  background: `linear-gradient(to top, ${theme.palette.action.active} 20%, transparent 40%)`,
                })}
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

      <Stack p={isGrid ? 0 : 1} width="100%" justifyContent="space-between">
        <CardHeader
          action={
            <Stack
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              gap={0.5}
              color="text.secondary"
              mt={1}
            >
              <CategoryIcon sx={{ height: 18, width: 18 }} />
              <Typography fontWeight={600} variant="caption">
                2.5
              </Typography>
            </Stack>
          }
          title={
            <Stack
              flexDirection="row"
              // justifyContent="center"
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
              <Avatar sx={{ height: 24, width: 24 }} />
              <Typography variant="h6">Kamruzzaman</Typography>
            </Stack>
          }
        />
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
    </Card>
  );
};

export default Listing;

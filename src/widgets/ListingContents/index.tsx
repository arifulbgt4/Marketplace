"use client";
export { default as Amenities } from "./Amenities";

import { FC, useState } from "react";
import { Box, Grid, Stack, Typography, Button, Divider } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import ImageIcon from "@mui/icons-material/Image";
import WifiIcon from "@mui/icons-material/Wifi";
import FlutterDashIcon from "@mui/icons-material/FlutterDash";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import MacroOffIcon from "@mui/icons-material/MacroOff";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import NoPhotographyIcon from "@mui/icons-material/NoPhotography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BathtubIcon from "@mui/icons-material/Bathtub";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BedIcon from "@mui/icons-material/Bed";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { amenities } from "src/global/staticData";

import Amenities from "./Amenities";
import { ListingContentsProps, OfferProps } from "./Types";

const amenityIcons: Record<string, JSX.Element> = {
  wifi: <WifiIcon />,
  parking: <CarCrashIcon />,
  kitchen: <RestaurantIcon />,
  air_conditioning: <WbTwilightIcon />,
  pool: <BathtubIcon />,
  gym: <EnhancedEncryptionIcon />,
  balcony: <ImageIcon />,
  pet_friendly: <FlutterDashIcon />,
  security: <LockIcon />,
  smoke_alarm: <NoPhotographyIcon />,
};

const ListingContents: FC<ListingContentsProps> = ({
  description = "",
  bedrooms,
  bathrooms,
  area,
  maxGuests,
  amenities: listingAmenities = [],
}) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <Grid container rowSpacing={3} mb={3}>
        <Grid container item xs={12} spacing={2}>
          {bedrooms !== undefined && bedrooms !== null && (
            <Grid item xs={12} md={6}>
              <Stack
                sx={(theme) => ({
                  border: `1px solid ${theme.palette.divider}`,
                })}
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                p={2}
                borderRadius={1}
                gap={2}
              >
                <BedIcon fontSize="large" />
                <Typography variant="subtitle1">
                  {bedrooms} {bedrooms === 1 ? "bedroom" : "bedrooms"}
                </Typography>
              </Stack>
            </Grid>
          )}
          {bathrooms !== undefined && bathrooms !== null && (
            <Grid item xs={12} md={6}>
              <Stack
                sx={(theme) => ({
                  border: `1px solid ${theme.palette.divider}`,
                })}
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                p={2}
                borderRadius={1}
                gap={2}
              >
                <BathtubIcon fontSize="large" />
                <Typography variant="subtitle1">
                  {bathrooms} {bathrooms === 1 ? "bathroom" : "bathrooms"}
                </Typography>
              </Stack>
            </Grid>
          )}
          {maxGuests !== undefined && maxGuests !== null && (
            <Grid item xs={12} md={6}>
              <Stack
                sx={(theme) => ({
                  border: `1px solid ${theme.palette.divider}`,
                })}
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                p={2}
                borderRadius={1}
                gap={2}
              >
                <PeopleAltIcon fontSize="large" />
                <Typography variant="subtitle1">
                  Up to {maxGuests} {maxGuests === 1 ? "guest" : "guests"}
                </Typography>
              </Stack>
            </Grid>
          )}
          {area !== undefined && area !== null && (
            <Grid item xs={12} md={6}>
              <Stack
                sx={(theme) => ({
                  border: `1px solid ${theme.palette.divider}`,
                })}
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                p={2}
                borderRadius={1}
                gap={2}
              >
                <LocationOnIcon fontSize="large" />
                <Typography variant="subtitle1">{area} sq ft</Typography>
              </Stack>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Stack flexDirection="row" gap={3} alignItems="flex-start" mb={3}>
        <MeetingRoomIcon />
        <Box maxWidth={260}>
          <Typography variant="body2">Great location</Typography>
          <Typography variant="body2" color="text.secondary">
            92% of recent guests gave the location a 5-star rating.
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ mb: 3 }} />
      {description && (
        <Stack gap={3} mb={3}>
          <Typography variant="h4">About this place</Typography>
          <Stack gap={3} onClick={() => setShowMore(!showMore)}>
            <Typography variant="subtitle1">
              {showMore ? description : `${description.substring(0, 259)}`}
              {!showMore && description.length > 259 && (
                <Box component="span" color="inherit">
                  <Typography component="span" variant="h3">
                    .....
                  </Typography>
                </Box>
              )}
            </Typography>
          </Stack>
          <Divider />
        </Stack>
      )}
      {listingAmenities.length > 0 && (
        <Offer amenities={listingAmenities} />
      )}
    </>
  );
};

export default ListingContents;

const Offer: FC<OfferProps> = ({ amenities: listingAmenities = [] }) => {
  return (
    <Stack gap={3} mb={3}>
      <Stack>
        <Typography variant="h4">What this place offers</Typography>
      </Stack>
      <Stack justifyContent="space-between" flexDirection={{ sm: "row" }}>
        <Stack>
          {listingAmenities.slice(0, Math.ceil(listingAmenities.length / 2)).map((amenity) => (
            <List key={amenity}>
              <ListItem disablePadding>
                <ListItemIcon>
                  {amenityIcons[amenity] || <WifiIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={amenity.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                />
              </ListItem>
            </List>
          ))}
        </Stack>
        <Stack>
          {listingAmenities.slice(Math.ceil(listingAmenities.length / 2)).map((amenity) => (
            <List key={amenity}>
              <ListItem disablePadding>
                <ListItemIcon>
                  {amenityIcons[amenity] || <WifiIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={amenity.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                />
              </ListItem>
            </List>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

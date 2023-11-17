"use client";
export { default as Amenities } from "./Amenities";

import { FC } from "react";
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
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { amenities } from "src/global/staticData";

import Amenities from "./Amenities";
import { ListingContentsProps, OfferProps } from "./Types";

const ListingContents: FC<ListingContentsProps> = () => {
  return (
    <>
      <Grid container rowSpacing={3} mb={3}>
        <Grid item xs={12}>
          <Typography variant="h4">
            Room in a bungalow hosted by Ramita
          </Typography>
        </Grid>
        <Grid container item xs={12} spacing={2}>
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
              <Typography variant="subtitle1">3 bedrooms 6 beds</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Amenities {...amenities[0]} />
          </Grid>
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
              <Typography variant="subtitle1">Shared bathroom</Typography>
            </Stack>
          </Grid>
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
                Host lives here with family
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <Stack gap={3} mb={3}>
        <Stack flexDirection="row" gap={3} alignItems="flex-start">
          <MeetingRoomIcon />
          <Box maxWidth={260}>
            <Typography variant="body2">Room in a bungalow</Typography>
            <Typography variant="body2" color="text.secondary">
              Your own room in a home, plus access to shared spaces.
            </Typography>
          </Box>
        </Stack>
        <Stack flexDirection="row" gap={3}>
          <PersonIcon />
          <Box maxWidth={260}>
            <Typography variant="body2">Ramita is a Superhost</Typography>
            <Typography variant="body2" color="text.secondary">
              Superhosts are experienced, highly rated Hosts.
            </Typography>
          </Box>
        </Stack>
        <Stack flexDirection="row" gap={3}>
          <LocationOnIcon />
          <Box maxWidth={260}>
            <Typography variant="body2">Great location</Typography>
            <Typography variant="body2" color="text.secondary">
              92% of recent guests gave the location a 5-star rating.
            </Typography>
          </Box>
        </Stack>
        <Divider />
      </Stack>
      <Stack gap={3} mb={3}>
        <Typography variant="h4">About this place</Typography>
        <Stack gap={3}>
          <Typography variant="subtitle1">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum
          </Typography>
          <Typography variant="subtitle1">
            Whether you want to stargaze, walk through the enchanting forest
            trails, submerge...
          </Typography>
          <Box>
            <Button color="inherit" endIcon={<KeyboardArrowRightIcon />}>
              show more
            </Button>
          </Box>
        </Stack>
        <Divider />
      </Stack>
      <Offer />
    </>
  );
};

export default ListingContents;

const Offer: FC<OfferProps> = () => {
  return (
    <Stack gap={3} mb={3}>
      <Stack>
        <Typography variant="h4">What this place offers</Typography>
      </Stack>
      <Stack justifyContent="space-between" flexDirection={{ sm: "row" }}>
        <Stack flexDirection="row" alignItems="center">
          <Stack>
            {offerData.slice(0, 5).map((data) => {
              const { id, name, icon } = data;
              return (
                <List key={id}>
                  <ListItem disablePadding>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={name} />
                  </ListItem>
                </List>
              );
            })}
          </Stack>
        </Stack>
        <Stack>
          {offerData.slice(5).map((data) => {
            const { id, name, icon } = data;
            return (
              <List key={id}>
                <ListItem disablePadding>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={name} />
                </ListItem>
              </List>
            );
          })}
        </Stack>
      </Stack>
      <Box>
        <Button size="large" color="inherit" variant="outlined">
          Show all 41 amenities
        </Button>
      </Box>
      <Divider />
    </Stack>
  );
};

const offerData = [
  {
    id: 1,
    name: "Lock on bedroom door",
    icon: <LockIcon />,
  },
  {
    id: 2,
    name: "Valley view",
    icon: <ImageIcon />,
  },
  {
    id: 3,
    name: "Wifi",
    icon: <WifiIcon />,
  },
  {
    id: 4,
    name: "Pets allowed",
    icon: <FlutterDashIcon />,
  },
  {
    id: 5,
    name: "Carbin monoxide alarm",
    icon: <WbTwilightIcon />,
  },
  {
    id: 6,
    name: "Garden view",
    icon: <MacroOffIcon />,
  },
  {
    id: 7,
    name: "Kitchen",
    icon: <RestaurantIcon />,
  },

  {
    id: 8,
    name: "Free parking on premises",
    icon: <CarCrashIcon />,
  },
  {
    id: 9,
    name: "Security cameras on property",
    icon: <EnhancedEncryptionIcon />,
  },
  {
    id: 10,
    name: "Smoke alarm",
    icon: <NoPhotographyIcon />,
  },
];

"use client";
import { FC } from "react";
import { Box, Stack, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import MailIcon from "@mui/icons-material/Mail";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { ContactInfoProps } from "./Types";

const ContactInfo: FC<ContactInfoProps> = () => {
  return (
    <List disablePadding>
      <ListItem disablePadding sx={{ pb: 4 }}>
        <ListItemIcon>
          <Stack
            justifyContent="center"
            alignItems="center"
            p={1.5}
            border={1}
            borderRadius={50}
            borderColor={(theme) => theme.palette.primary.main}
          >
            <PlaceIcon color="primary" />
          </Stack>
        </ListItemIcon>
        <ListItemText
          primary={
            <Box pl={1.5}>
              <Typography variant="h6">3605 Parker Rd.</Typography>
            </Box>
          }
        />
      </ListItem>
      <ListItem disablePadding sx={{ pb: 4 }}>
        <ListItemIcon>
          <Stack
            justifyContent="center"
            alignItems="center"
            p={1.5}
            border={1}
            borderRadius={50}
            borderColor={(theme) => theme.palette.primary.main}
          >
            <PhoneIphoneIcon color="primary" />
          </Stack>
        </ListItemIcon>
        <ListItemText
          primary={
            <Box pl={1.5}>
              <Typography variant="h6">(207) 555-0119</Typography>
            </Box>
          }
        />
      </ListItem>
      <ListItem disablePadding>
        <ListItemIcon>
          <Stack
            justifyContent="center"
            alignItems="center"
            p={1.5}
            border={1}
            borderRadius={50}
            borderColor={(theme) => theme.palette.primary.main}
          >
            <MailIcon color="primary" />
          </Stack>
        </ListItemIcon>
        <ListItemText
          primary={
            <Box pl={1.5}>
              <Typography variant="h6">nvt.isst.nute@gmail.com</Typography>
            </Box>
          }
        />
      </ListItem>
    </List>
    // <Stack
    //   justifyContent="space-between"
    //   alignItems="center"
    //   height="100%"
    //   bgcolor="red"
    // >
    //   <Stack flexDirection="row">
    //     <Box p={1.5} border={1}>
    //       <PlaceIcon />
    //     </Box>
    //     <Typography variant="h6">3605 Parker Rd.</Typography>
    //   </Stack>
    //   <Stack>
    //     <Box p={1.5} border={1}>
    //       <PhoneIphoneIcon />
    //     </Box>
    //     <Typography variant="h6">3605 Parker Rd.</Typography>
    //   </Stack>
    //   <Stack>
    //     <Box p={1.5} border={1}>
    //       <MailIcon />
    //     </Box>
    //     <Typography variant="h6">3605 Parker Rd.</Typography>
    //   </Stack>
    // </Stack>
  );
};

export default ContactInfo;

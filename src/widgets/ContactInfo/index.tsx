"use client";
import { FC } from "react";
import { Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import MailIcon from "@mui/icons-material/Mail";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { ContactInfoProps } from "./Types";

const ContactInfo: FC<ContactInfoProps> = () => {
  return (
    <List disablePadding>
      <ListItem disablePadding sx={{ pb: { xs: 2, md: 5 } }}>
        <MailIcon color="primary" />
        <ListItemText
          sx={{ pl: 3 }}
          primary={
            <Typography variant="h6">nvt.isst.nute@gmail.com</Typography>
          }
        />
      </ListItem>
      <ListItem disablePadding sx={{ pb: { xs: 2, md: 5 } }}>
        <PhoneIphoneIcon color="primary" />
        <ListItemText
          sx={{ pl: 3 }}
          primary={<Typography variant="h6">(207) 555-0119</Typography>}
        />
      </ListItem>
      <ListItem disablePadding>
        <PlaceIcon color="primary" />
        <ListItemText
          sx={{ pl: 3 }}
          primary={<Typography variant="h6">www.trivers.com</Typography>}
        />
      </ListItem>
    </List>
  );
};

export default ContactInfo;

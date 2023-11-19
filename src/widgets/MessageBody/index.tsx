"use client";
import { FC } from "react";
import {
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from "@mui/material";

import { MessageBodyProps } from "./Types";

const MessageBody: FC<MessageBodyProps> = () => {
  return (
    <List sx={{ maxHeight: "70vh", overflow: "auto" }}>
      <Grid container pl={6.5} pr={9.5} rowSpacing={3}>
        <Grid item xs={12} container>
          <Grid item xs={8}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt="Remy Sharp"
                  src="https://scontent.fdac151-1.fna.fbcdn.net/v/t39.30808-6/300800665_2886053571698495_5000268853890496281_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHDGs-ZTQmgVKi69kuh8pvNBMMzIBxEmEIEwzMgHESYQroqy0geua7szTa6y86WKG37yOIBX5IH50_0AxEIqdD4&_nc_ohc=AsYXOTsUcUQAX8VCZd1&_nc_ht=scontent.fdac151-1.fna&oh=00_AfBYvCM3ZejwUBz81Q-EvS-3zWbt5ptjx3ZHwPEDQlfjDA&oe=655C0E0D"
                />
              </ListItemAvatar>
              <Paper elevation={2} sx={{ pl: 1.5, pr: 2.5, borderRadius: 2 }}>
                <ListItemText>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, to
                </ListItemText>
              </Paper>
            </ListItem>
          </Grid>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={4}></Grid>
          <Grid item xs={8}>
            <ListItem alignItems="flex-start">
              <Paper elevation={2} sx={{ pl: 1.5, pr: 2.5, borderRadius: 2 }}>
                <ListItemText>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, to
                </ListItemText>
              </Paper>
              <ListItemAvatar sx={{ pl: 2 }}>
                <Avatar
                  alt="Remy Sharp"
                  src="https://scontent.fdac151-1.fna.fbcdn.net/v/t39.30808-6/300800665_2886053571698495_5000268853890496281_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHDGs-ZTQmgVKi69kuh8pvNBMMzIBxEmEIEwzMgHESYQroqy0geua7szTa6y86WKG37yOIBX5IH50_0AxEIqdD4&_nc_ohc=AsYXOTsUcUQAX8VCZd1&_nc_ht=scontent.fdac151-1.fna&oh=00_AfBYvCM3ZejwUBz81Q-EvS-3zWbt5ptjx3ZHwPEDQlfjDA&oe=655C0E0D"
                />
              </ListItemAvatar>
            </ListItem>
          </Grid>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={8}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt="Travis Howard"
                  src="https://scontent.fdac151-1.fna.fbcdn.net/v/t39.30808-6/300800665_2886053571698495_5000268853890496281_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHDGs-ZTQmgVKi69kuh8pvNBMMzIBxEmEIEwzMgHESYQroqy0geua7szTa6y86WKG37yOIBX5IH50_0AxEIqdD4&_nc_ohc=AsYXOTsUcUQAX8VCZd1&_nc_ht=scontent.fdac151-1.fna&oh=00_AfBYvCM3ZejwUBz81Q-EvS-3zWbt5ptjx3ZHwPEDQlfjDA&oe=655C0E0D"
                />
              </ListItemAvatar>
              <Paper elevation={2} sx={{ pl: 1.5, pr: 2.5, borderRadius: 2 }}>
                <ListItemText>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, to
                </ListItemText>
              </Paper>
            </ListItem>
          </Grid>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={4}></Grid>
          <Grid item xs={8}>
            <ListItem alignItems="flex-start">
              <Paper elevation={2} sx={{ pl: 1.5, pr: 2.5, borderRadius: 2 }}>
                <ListItemText>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, to
                </ListItemText>
              </Paper>
              <ListItemAvatar sx={{ pl: 2 }}>
                <Avatar
                  alt="Remy Sharp"
                  src="https://scontent.fdac151-1.fna.fbcdn.net/v/t39.30808-6/300800665_2886053571698495_5000268853890496281_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHDGs-ZTQmgVKi69kuh8pvNBMMzIBxEmEIEwzMgHESYQroqy0geua7szTa6y86WKG37yOIBX5IH50_0AxEIqdD4&_nc_ohc=AsYXOTsUcUQAX8VCZd1&_nc_ht=scontent.fdac151-1.fna&oh=00_AfBYvCM3ZejwUBz81Q-EvS-3zWbt5ptjx3ZHwPEDQlfjDA&oe=655C0E0D"
                />
              </ListItemAvatar>
            </ListItem>
          </Grid>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={8}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt="Travis Howard"
                  src="https://scontent.fdac151-1.fna.fbcdn.net/v/t39.30808-6/300800665_2886053571698495_5000268853890496281_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHDGs-ZTQmgVKi69kuh8pvNBMMzIBxEmEIEwzMgHESYQroqy0geua7szTa6y86WKG37yOIBX5IH50_0AxEIqdD4&_nc_ohc=AsYXOTsUcUQAX8VCZd1&_nc_ht=scontent.fdac151-1.fna&oh=00_AfBYvCM3ZejwUBz81Q-EvS-3zWbt5ptjx3ZHwPEDQlfjDA&oe=655C0E0D"
                />
              </ListItemAvatar>
              <Paper elevation={2} sx={{ pl: 1.5, pr: 2.5, borderRadius: 2 }}>
                <ListItemText>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, to
                </ListItemText>
              </Paper>
            </ListItem>
          </Grid>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={4}></Grid>
          <Grid item xs={8}>
            <ListItem alignItems="flex-start">
              <Paper elevation={2} sx={{ pl: 1.5, pr: 2.5, borderRadius: 2 }}>
                <ListItemText>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, to
                </ListItemText>
              </Paper>
              <ListItemAvatar sx={{ pl: 2 }}>
                <Avatar
                  alt="Remy Sharp"
                  src="https://scontent.fdac151-1.fna.fbcdn.net/v/t39.30808-6/300800665_2886053571698495_5000268853890496281_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHDGs-ZTQmgVKi69kuh8pvNBMMzIBxEmEIEwzMgHESYQroqy0geua7szTa6y86WKG37yOIBX5IH50_0AxEIqdD4&_nc_ohc=AsYXOTsUcUQAX8VCZd1&_nc_ht=scontent.fdac151-1.fna&oh=00_AfBYvCM3ZejwUBz81Q-EvS-3zWbt5ptjx3ZHwPEDQlfjDA&oe=655C0E0D"
                />
              </ListItemAvatar>
            </ListItem>
          </Grid>
        </Grid>
      </Grid>
    </List>
  );
};

export default MessageBody;

"use client";
import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import {
  Grid,
  Select,
  Stack,
  CardHeader,
  Avatar,
  Typography,
  FormControl,
  ListItemText,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { KeyboardArrowRight, UploadFile } from "@mui/icons-material";

import { TextField } from "src/components/Input";

import { ChatApplicationProps } from "./Types";
import Button from "@mui/material/Button";

const ChatApplication: FC<ChatApplicationProps> = () => {
  return (
    <Grid container>
      <Grid item xs={3}>
        <FormControl fullWidth>
          <InputLabel>kdkfdf</InputLabel>
          <Select />
        </FormControl>
      </Grid>
      <Grid item xs={9}>
        <Stack
          sx={{
            borderLeft:
              "1px solid var(--action-disabled-background, rgba(0, 0, 0, 0.12))",
          }}
        >
          <Box
            pl={5}
            pr={9.5}
            sx={{
              borderBottom:
                " 1px solid var(--action-disabled-background, rgba(0, 0, 0, 0.12))",
              position: "sticky",
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  alt="avator image"
                  src="https://scontent.fdac151-1.fna.fbcdn.net/v/t39.30808-6/300800665_2886053571698495_5000268853890496281_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHDGs-ZTQmgVKi69kuh8pvNBMMzIBxEmEIEwzMgHESYQroqy0geua7szTa6y86WKG37yOIBX5IH50_0AxEIqdD4&_nc_ohc=AsYXOTsUcUQAX8VCZd1&_nc_ht=scontent.fdac151-1.fna&oh=00_AfBYvCM3ZejwUBz81Q-EvS-3zWbt5ptjx3ZHwPEDQlfjDA&oe=655C0E0D"
                />
              }
              title="Jennifer Fritz"
              subheader="Active now"
              action={
                <Stack direction="row" alignItems="center">
                  <IconButton aria-label="search" sx={{ p: 1.5 }}>
                    <SearchIcon />
                  </IconButton>
                  <IconButton aria-label="settings" sx={{ p: 1.5 }}>
                    <SettingsIcon />
                  </IconButton>
                </Stack>
              }
            />
          </Box>
          <Box sx={{ height: "60vh", overflow: "auto" }}>
            <List>
              <Grid container pl={6.5} pr={9.5} py={8} rowSpacing={3}>
                <Grid item xs={12} container>
                  <Grid item xs={8}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src="https://scontent.fdac151-1.fna.fbcdn.net/v/t39.30808-6/300800665_2886053571698495_5000268853890496281_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHDGs-ZTQmgVKi69kuh8pvNBMMzIBxEmEIEwzMgHESYQroqy0geua7szTa6y86WKG37yOIBX5IH50_0AxEIqdD4&_nc_ohc=AsYXOTsUcUQAX8VCZd1&_nc_ht=scontent.fdac151-1.fna&oh=00_AfBYvCM3ZejwUBz81Q-EvS-3zWbt5ptjx3ZHwPEDQlfjDA&oe=655C0E0D"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        sx={{
                          pl: 1.5,
                          pr: 2.5,
                          borderRadius: 2,
                          bgcolor: "#F5F5F5",
                          boxShadow:
                            "0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.20)",
                        }}
                      >
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, to
                      </ListItemText>
                    </ListItem>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={8}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        sx={{
                          pl: 1.5,
                          pr: 2.5,
                          borderRadius: 2,
                          bgcolor: "#F5F5F5",
                          boxShadow:
                            "0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.20)",
                        }}
                      >
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, to
                      </ListItemText>
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
                      <ListItemText
                        sx={{
                          pl: 1.5,
                          pr: 2.5,
                          borderRadius: 2,
                          bgcolor: "#F5F5F5",
                          boxShadow:
                            "0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.20)",
                        }}
                      >
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, to
                      </ListItemText>
                    </ListItem>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={8}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        sx={{
                          pl: 1.5,
                          pr: 2.5,
                          borderRadius: 2,
                          bgcolor: "#F5F5F5",
                          boxShadow:
                            "0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.20)",
                        }}
                      >
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, to
                      </ListItemText>
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
                      <ListItemText
                        sx={{
                          pl: 1.5,
                          pr: 2.5,
                          borderRadius: 2,
                          bgcolor: "#F5F5F5",
                          boxShadow:
                            "0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.20)",
                        }}
                      >
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, to
                      </ListItemText>
                    </ListItem>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={8}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        sx={{
                          pl: 1.5,
                          pr: 2.5,
                          borderRadius: 2,
                          bgcolor: "#F5F5F5",
                          boxShadow:
                            "0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.20)",
                        }}
                      >
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, to
                      </ListItemText>
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
          </Box>
          <Box>
            <SendMessage />
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

const SendMessage = () => {
  const onSubmitForm = async () => {};

  return (
    <FinalForm
      onSubmit={onSubmitForm}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Box
              borderTop={
                "1px solid var(--action-disabled-background, rgba(0, 0, 0, 0.12))"
              }
              pl={5}
              pr={12}
              py={3.5}
            >
              <Stack direction="row" justifyContent="space-between">
                <Box pl={5}>
                  <TextField
                    variant="standard"
                    multiline
                    name="typemessage"
                    placeholder="type message"
                    fullWidth
                    InputProps={{ disableUnderline: true }}
                  />
                </Box>
                <Stack direction="row">
                  <IconButton>
                    <EmojiEmotionsIcon />
                  </IconButton>
                  <IconButton>
                    <UploadFile />
                  </IconButton>
                  <Button
                    size="large"
                    endIcon={<KeyboardArrowRight />}
                    variant="contained"
                  >
                    send
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </form>
        );
      }}
    />
  );
};

export default ChatApplication;

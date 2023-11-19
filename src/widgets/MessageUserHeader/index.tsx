import { FC } from "react";
import { Avatar, Box, CardHeader, IconButton, Stack } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";

import { MessageUserHeaderProps } from "./Types";

const MessageUserHeader: FC<MessageUserHeaderProps> = () => {
  return (
    <Box
      pl={5}
      pr={9.5}
      borderBottom={1}
      borderColor={(theme) => theme.palette.action.disabledBackground}
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
  );
};

export default MessageUserHeader;

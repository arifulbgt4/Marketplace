import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { UserProps } from "./Tyepes";
import { toggleMessagesPane } from "./util";
import { Box } from "@mui/material";

type MessagesPaneHeaderProps = {
  sender: UserProps;
};

export default function MessagesPaneHeader(props: MessagesPaneHeaderProps) {
  const { sender } = props;
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.body",
      }}
      py={{ xs: 2, md: 2 }}
      px={{ xs: 1, md: 2 }}
    >
      <Stack direction="row" spacing={{ xs: 1, md: 2 }} alignItems="center">
        <IconButton
          size="small"
          sx={{
            display: { xs: "inline-flex", sm: "none" },
          }}
          onClick={() => toggleMessagesPane()}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <Avatar sizes="large" src={sender.avatar} />
        <Box>
          <Typography variant="h4">
            {sender.name}
            {sender.online ? (
              <Chip
                label="Online"
                variant="outlined"
                size="small"
                color="default"
                sx={{
                  borderRadius: 1,
                }}
                icon={<CircleIcon sx={{ fontSize: 8 }} color="success" />}
              />
            ) : undefined}
          </Typography>

          <Typography variant="subtitle1">{sender.username}</Typography>
        </Box>
      </Stack>
      <Stack spacing={1} direction="row" alignItems="center">
        <Button
          startIcon={<PhoneInTalkRoundedIcon />}
          variant="outlined"
          size="small"
          sx={{
            display: { xs: "none", md: "inline-flex" },
          }}
        >
          Call
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{
            display: { xs: "none", md: "inline-flex" },
          }}
        >
          View profile
        </Button>
        <IconButton size="small">
          <MoreVertRoundedIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}

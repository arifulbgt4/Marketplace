import { useState } from "react";
import {
  Paper,
  Avatar,
  Box,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";

import { MessageProps } from "./Types";

type ChatBubbleProps = MessageProps & {
  variant: "sent" | "received";
};

export default function ChatBubble(props: ChatBubbleProps) {
  const { content, variant, timestamp, attachment = undefined, sender } = props;
  const isSent = variant === "sent";
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isCelebrated, setIsCelebrated] = useState<boolean>(false);
  return (
    <Box sx={{ maxWidth: "60%", minWidth: "auto" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 0.25 }}
      >
        <Typography>{sender === "You" ? sender : sender.name}</Typography>
        <Typography variant="subtitle2">{timestamp}</Typography>
      </Stack>
      {attachment ? (
        <Paper
          sx={{
            border: 1,
            px: 1.75,
            py: 1.25,
            borderRadius: 1,
            borderTopRightRadius: isSent ? 0 : 2,
            borderTopLeftRadius: isSent ? 2 : 0,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar color="primary">
              <InsertDriveFileRoundedIcon />
            </Avatar>
            <Box>
              <Typography>{attachment.fileName}</Typography>
              <Typography>{attachment.size}</Typography>
            </Box>
          </Stack>
        </Paper>
      ) : (
        <Box
          sx={{ position: "relative" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Paper
            color={isSent ? "primary" : "default"}
            sx={{
              p: 1.25,

              borderTopRightRadius: isSent ? 0 : 10,
              borderTopLeftRadius: isSent ? 10 : 0,
              backgroundColor: isSent ? "primary.main" : "Background.default",
            }}
          >
            <Typography
              sx={{
                color: isSent ? "common.white" : "text.primary",
              }}
            >
              {content}
            </Typography>
          </Paper>
          {(isHovered || isLiked || isCelebrated) && (
            <Stack
              direction="row"
              justifyContent={isSent ? "flex-end" : "flex-start"}
              spacing={0.5}
              sx={{
                position: "absolute",
                top: "50%",
                p: 1.5,
                ...(isSent
                  ? {
                      left: 0,
                      transform: "translate(-100%, -50%)",
                    }
                  : {
                      right: 0,
                      transform: "translate(100%, -50%)",
                    }),
              }}
            >
              <IconButton
                color={isLiked ? "error" : "default"}
                size="small"
                onClick={() => setIsLiked((prevState) => !prevState)}
              >
                {isLiked ? "❤️" : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton
                color={isCelebrated ? "warning" : "default"}
                size="small"
                onClick={() => setIsCelebrated((prevState) => !prevState)}
              >
                {isCelebrated ? "🎉" : <CelebrationOutlinedIcon />}
              </IconButton>
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
}

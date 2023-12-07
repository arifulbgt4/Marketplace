import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Textarea from "@mui/material";
import { IconButton, Stack } from "@mui/material";

import FormatBoldRoundedIcon from "@mui/icons-material/FormatBoldRounded";
import FormatItalicRoundedIcon from "@mui/icons-material/FormatItalicRounded";
import StrikethroughSRoundedIcon from "@mui/icons-material/StrikethroughSRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import TextField from "@mui/material/TextField";

export type MessageInputProps = {
  textAreaValue: string;
  setTextAreaValue: (value: string) => void;
  onSubmit: () => void;
};

export default function MessageInput(props: MessageInputProps) {
  const { textAreaValue, setTextAreaValue, onSubmit } = props;
  const textAreaRef = React.useRef<HTMLDivElement>(null);
  const handleClick = () => {
    if (textAreaValue.trim() !== "") {
      onSubmit();
      setTextAreaValue("");
    }
  };
  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <FormControl fullWidth>
        <TextField
          fullWidth
          placeholder="Type something here…"
          aria-label="Message"
          ref={textAreaRef}
          onChange={(e) => {
            setTextAreaValue(e.target.value);
          }}
          value={textAreaValue}
          minRows={3}
          maxRows={10}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              handleClick();
            }
          }}
          sx={{
            "& textarea:first-of-type": {
              minHeight: 72,
            },
          }}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexGrow={1}
          sx={{
            py: 1,
            pr: 1,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <div>
            <IconButton size="small">
              <FormatBoldRoundedIcon />
            </IconButton>
            <IconButton size="small">
              <FormatItalicRoundedIcon />
            </IconButton>
            <IconButton size="small">
              <StrikethroughSRoundedIcon />
            </IconButton>
            <IconButton size="small">
              <FormatListBulletedRoundedIcon />
            </IconButton>
          </div>
          <Button
            size="small"
            color="primary"
            sx={{ alignSelf: "center", borderRadius: 1 }}
            startIcon={<SendRoundedIcon />}
            onClick={handleClick}
          >
            Send
          </Button>
        </Stack>
      </FormControl>
    </Box>
  );
}

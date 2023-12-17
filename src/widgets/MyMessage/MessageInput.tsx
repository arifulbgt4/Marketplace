import { useRef } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  IconButton,
  Stack,
} from "@mui/material";
import FormatBoldRoundedIcon from "@mui/icons-material/FormatBoldRounded";
import FormatItalicRoundedIcon from "@mui/icons-material/FormatItalicRounded";
import StrikethroughSRoundedIcon from "@mui/icons-material/StrikethroughSRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

export type MessageInputProps = {
  textAreaValue: string;
  setTextAreaValue: (value: string) => void;
  onSubmit: () => void;
};

export default function MessageInput(props: MessageInputProps) {
  const { textAreaValue, setTextAreaValue, onSubmit } = props;
  const textAreaRef = useRef<HTMLDivElement>(null);
  const handleClick = () => {
    if (textAreaValue.trim() !== "") {
      onSubmit();
      setTextAreaValue("");
    }
  };
  return (
    <Box sx={{ px: { md: 2, xs: 1 }, pb: 2 }}>
      <FormControl
        fullWidth
        sx={{ border: 2, borderColor: "divider", borderRadius: 2 }}
      >
        <Box pl={1}>
          <TextField
            multiline
            variant="standard"
            size="medium"
            fullWidth
            placeholder="Type something here…"
            aria-label="Message"
            ref={textAreaRef}
            InputProps={{ disableUnderline: true }}
            onChange={(e) => {
              setTextAreaValue(e.target.value);
            }}
            value={textAreaValue}
            minRows={1}
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
        </Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexGrow={1}
          py={1}
          pr={1}
          borderTop={2}
          borderColor="divider"
        >
          <Box>
            <IconButton size="small" disableRipple>
              <FormatBoldRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" disableRipple>
              <FormatItalicRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" disableRipple>
              <StrikethroughSRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" disableRipple>
              <FormatListBulletedRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
          <Button
            size="small"
            color="primary"
            variant="contained"
            sx={{ alignSelf: "center", borderRadius: 1 }}
            endIcon={<SendRoundedIcon fontSize="small" />}
            onClick={handleClick}
          >
            Send
          </Button>
        </Stack>
      </FormControl>
    </Box>
  );
}

"use client";
import { Form as FinalForm } from "react-final-form";
import { Box, Stack } from "@mui/material";
import { TextField } from "src/components/Input";
import IconButton from "@mui/material/IconButton";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { UploadFile, KeyboardArrowRight } from "@mui/icons-material";
import Button from "@mui/material/Button";
const SendMessageForm = () => {
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
              py={3}
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

export default SendMessageForm;

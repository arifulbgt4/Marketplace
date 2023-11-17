"use client";
import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import { Box, Stack, Button, IconButton } from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { UploadFile, KeyboardArrowRight } from "@mui/icons-material";

import { TextField } from "src/components/Input";

import { SendMessageFormProps } from "./Types";

const SendMessageForm: FC<SendMessageFormProps> = () => {
  const onSubmitForm = async () => {};

  return (
    <FinalForm
      onSubmit={onSubmitForm}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Box
              borderTop={1}
              borderColor={(theme) => theme.palette.action.disabledBackground}
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

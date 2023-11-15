"use client";
import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import { Paper, Stack, Box, IconButton, Typography } from "@mui/material";

import { UserMediaFormProps } from "./Types";
import { UploadImage } from "src/components/Input";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const UserMediaForm: FC<UserMediaFormProps> = () => {
  const onSubmitForm = async () => {};
  return (
    <Paper>
      <FinalForm
        onSubmit={onSubmitForm}
        render={({ handleSubmit, values, errors, submitting }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Stack
                direction="row"
                justifyContent="space-around"
                alignItems="center"
              >
                <Typography>Avator</Typography>
                <UploadImage
                  multiple
                  name="image"
                  previewRender={(src, onRemove) => {
                    return src.map((data, index) => {
                      return (
                        <Stack key={index} position="relative">
                          <Box>
                            <Image
                              src={data}
                              width={100}
                              height={100}
                              alt="upload"
                            />
                          </Box>
                          <IconButton
                            color="error"
                            onClick={() => onRemove(index)}
                            sx={{ position: "absolute", width: 100 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      );
                    });
                  }}
                >
                  <Box
                    p={1}
                    bgcolor="gray"
                    borderRadius={2}
                    width={100}
                    sx={{ cursor: "pointer" }}
                    justifyItems="center"
                  >
                    <AddIcon />
                  </Box>
                </UploadImage>
              </Stack>
            </form>
          );
        }}
      />
    </Paper>
  );
};

export default UserMediaForm;

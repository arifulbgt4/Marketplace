"use client";
import { FC, useRef } from "react";
import { Form as FinalForm } from "react-final-form";
import {
  CropperRef,
  Cropper,
  CircleStencil,
  ImageRestriction,
} from "react-advanced-cropper";
import {
  Stack,
  IconButton,
  Typography,
  Grid,
  Button,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { UploadImage } from "src/components/Input";

import { UserMediaFormProps } from "./Types";
import "react-advanced-cropper/dist/style.css";

const UserMediaForm: FC<UserMediaFormProps> = () => {
  const onSubmitForm = async () => {};
  const cropperRef = useRef<CropperRef>(null);

  const move = () => {
    if (cropperRef.current) {
      cropperRef.current.moveImage(50, 100);
    }
  };

  return (
    <FinalForm
      onSubmit={onSubmitForm}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Typography variant="h6" textAlign="center">
                  Avater
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                display="flex"
                flexDirection="row"
                justifyContent="center"
                flexWrap="wrap"
                gap={2}
              >
                <UploadImage
                  name="image"
                  previewRender={(src, onRemove) => {
                    return (
                      <Stack flexDirection="row" gap={8}>
                        {src.map((data, index) => {
                          return (
                            <Stack
                              key={index}
                              position="relative"
                              flexWrap="wrap"
                            >
                              <Box height={400} width={400}>
                                <Cropper
                                  ref={cropperRef}
                                  onMove={move}
                                  src={data}
                                  stencilComponent={CircleStencil}
                                  imageRestriction={ImageRestriction.fitArea}
                                />
                              </Box>
                              <IconButton
                                onClick={() => onRemove(index)}
                                sx={(theme) => ({
                                  position: "absolute",
                                  right: -6,
                                  top: -6,
                                  border: `2px solid ${theme.palette.divider}`,
                                  p: 0,
                                  bgcolor: theme.palette.common.white,
                                  ":hover": {
                                    bgcolor: theme.palette.common.white,
                                  },
                                })}
                              >
                                <CloseIcon sx={{ height: 18, width: 18 }} />
                              </IconButton>
                              <Button variant="contained" sx={{ mt: 1 }}>
                                Update
                              </Button>
                            </Stack>
                          );
                        })}
                      </Stack>
                    );
                  }}
                >
                  <Stack
                    sx={(theme) => ({
                      cursor: "pointer",
                      bgcolor: theme.palette.grey[300],
                      borderRadius: 1,
                    })}
                    width={400}
                    height={400}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <AddIcon sx={{ height: 40, width: 40 }} />
                  </Stack>
                </UploadImage>
              </Grid>
            </Grid>
          </form>
        );
      }}
    />
  );
};

export default UserMediaForm;

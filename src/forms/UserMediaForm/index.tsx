"use client";
import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import {
  Paper,
  Stack,
  IconButton,
  Typography,
  CardMedia,
  Grid,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Card from "@mui/material/Card";
import CloseIcon from "@mui/icons-material/Close";

import { UploadImage } from "src/components/Input";

import { UserMediaFormProps } from "./Types";

const UserMediaForm: FC<UserMediaFormProps> = () => {
  const onSubmitForm = async () => {};
  return (
    <FinalForm
      onSubmit={onSubmitForm}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Paper>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                  <Typography variant="h6" textAlign="center">
                    Avator
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
                        <Stack flexDirection="row" gap={2}>
                          {src.map((data, index) => {
                            return (
                              <Stack
                                key={index}
                                position="relative"
                                flexWrap="wrap"
                              >
                                <Card>
                                  <CardMedia
                                    src={data}
                                    component="img"
                                    sx={{ height: 150, width: 150 }}
                                  />
                                </Card>
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
                      width={150}
                      height={150}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <AddIcon sx={{ height: 40, width: 40 }} />
                    </Stack>
                  </UploadImage>
                </Grid>
              </Grid>
            </Paper>
          </form>
        );
      }}
    />
  );
};

export default UserMediaForm;

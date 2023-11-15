import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import {
  Grid,
  IconButton,
  Stack,
  Typography,
  Card,
  CardMedia,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { UploadImage } from "src/components/Input";

import { Step5Props } from "./Types";

const Step5: FC<Step5Props> = () => {
  const onSubmitForm = async () => {};

  return (
    <FinalForm
      onSubmit={onSubmitForm}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Typography variant="h6" textAlign="center">
                  Upload Image
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
                <UploadImg />
              </Grid>
            </Grid>
          </form>
        );
      }}
    />
  );
};

export default Step5;

const UploadImg = () => {
  return (
    <UploadImage
      multiple
      name="image"
      previewRender={(src, onRemove) => {
        return (
          <Stack flexDirection="row" gap={2}>
            {src.map((data, index) => {
              return (
                <Stack key={index} position="relative" flexWrap="wrap">
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
                      ":hover": { bgcolor: theme.palette.common.white },
                    })}
                  >
                    <CloseIcon sx={{ height: 18, width: 18 }} />
                  </IconButton>
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
  );
};

import { FC } from "react";
import Image from "next/image";
import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { UploadImage } from "src/components/Input";
import { Step5Props } from "./Types";

const Step5: FC<Step5Props> = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h6" textAlign="center">
          Upload Image
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <UploadImage
          multiple
          name="image"
          previewRender={(src, onRemove) => {
            return src.map((data, index) => {
              return (
                <Stack key={index} position="relative">
                  <Box sx={{ ":hover": {} }}>
                    <Image src={data} width={100} height={100} alt="upload" />
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
          <Stack
            direction="row"
            p={1}
            bgcolor="gray"
            borderRadius={2}
            width={100}
            sx={{ cursor: "pointer" }}
          >
            <AddIcon />
          </Stack>
        </UploadImage>
      </Grid>
    </Grid>
  );
};

export default Step5;

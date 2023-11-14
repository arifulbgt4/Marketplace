"use client";
import Image from "next/image";
import { Box, Stack, Typography } from "@mui/material";
import WidgetsIcon from "@mui/icons-material/Widgets";
import type { RenderPhotoProps } from "react-photo-album";

export default function NextJsImage({
  photo,
  imageProps: { alt, title, sizes, className, onClick },
  wrapperStyle,
  layout: { index },
}: RenderPhotoProps) {
  return (
    <Box
      sx={{
        ...wrapperStyle,
        position: "relative",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Image
        fill
        src={photo}
        placeholder={"blurDataURL" in photo ? "blur" : undefined}
        {...{ alt, title, sizes, className, onClick }}
      />
      {index === 9 && (
        <Stack
          onClick={onClick}
          position="absolute"
          justifyContent="center"
          alignItems="center"
          sx={(theme) => ({
            right: 0,
            bottom: 0,
            top: 0,
            left: 0,
            background: theme.palette.action.active,
          })}
        >
          <Typography
            color="white"
            variant="subtitle1"
            textTransform="uppercase"
            display="flex"
            alignItems="center"
          >
            <WidgetsIcon sx={{ mr: 1 }} />
            Show all photos
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

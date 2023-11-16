"use client";
import Image from "next/image";
import { Box, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { RenderImageProps } from "./Types";

export default function RenderImage(props: RenderImageProps) {
  const {
    photo,
    imageProps: { alt, title, sizes, className, onClick },
    wrapperStyle,
    layout: { index },
    renderDefaultPhoto,
    length,
  } = props;
  return (
    <Box
      sx={{
        ...wrapperStyle,
        position: "relative",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {renderDefaultPhoto({ wrapped: true })}

      {index === 9 && length > 10 && (
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
            variant="h1"
            textTransform="uppercase"
            display="flex"
            alignItems="center"
            fontWeight={100}
            // fontSize={50}
          >
            <AddIcon fontSize="inherit" />
            {length - 10}
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

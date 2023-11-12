"use client";
import { FC, useRef } from "react";
import Image from "next/image";
import { Box, Grid, Button, Typography } from "@mui/material";
import WidgetsIcon from "@mui/icons-material/Widgets";

import AlbumImage from "./AlbumImage";

import { AlbumProps } from "./Types";

const SPACING = 1;

export const Album: FC<AlbumProps> = ({ albumImg }) => {
  if (albumImg.length > 5) {
    return (
      <Grid container spacing={SPACING}>
        <Grid item xs={6}>
          <AlbumImage spacing={SPACING} src={albumImg[0]} />
        </Grid>
        <Grid item xs={6} container spacing={SPACING}>
          <Grid item xs={6}>
            <AlbumImage spacing={SPACING} src={albumImg[1]} />
          </Grid>
          <Grid item xs={6}>
            <AlbumImage spacing={SPACING} src={albumImg[2]} />
          </Grid>
          <Grid item xs={6}>
            <AlbumImage spacing={SPACING} src={albumImg[3]} />
          </Grid>
          <Grid item xs={6} position="relative">
            <AlbumImage spacing={SPACING} src={albumImg[4]} />
            <Box
              position="absolute"
              sx={(theme) => ({
                ml: theme.spacing(SPACING + 1),
                right: theme.spacing(SPACING + 1),
                bottom: theme.spacing(SPACING + 1),
              })}
            >
              <Button
                startIcon={<WidgetsIcon />}
                variant="contained"
                size="large"
                color="inherit"
              >
                Show all photos
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    );
  } else if (albumImg.length === 5) {
    return (
      <Grid container spacing={SPACING}>
        <Grid item xs={6}>
          <AlbumImage spacing={SPACING} src={albumImg[0]} />
        </Grid>
        <Grid item xs={6} container spacing={SPACING}>
          <Grid item xs={6}>
            <AlbumImage spacing={SPACING} src={albumImg[1]} />
          </Grid>
          <Grid item xs={6}>
            <AlbumImage spacing={SPACING} src={albumImg[2]} />
          </Grid>
          <Grid item xs={6}>
            <AlbumImage spacing={SPACING} src={albumImg[3]} />
          </Grid>
          <Grid item xs={6}>
            <AlbumImage spacing={SPACING} src={albumImg[4]} />
          </Grid>
        </Grid>
      </Grid>
    );
  } else if (albumImg.length === 4) {
    return (
      <Grid container spacing={SPACING}>
        <Grid item xs={6}>
          <AlbumImage half spacing={SPACING} src={albumImg[0]} />
        </Grid>
        <Grid item xs={6}>
          <AlbumImage half spacing={SPACING} src={albumImg[1]} />
        </Grid>
        <Grid item xs={6}>
          <AlbumImage half spacing={SPACING} src={albumImg[2]} />
        </Grid>
        <Grid item xs={6}>
          <AlbumImage half spacing={SPACING} src={albumImg[3]} />
        </Grid>
      </Grid>
    );
  } else if (albumImg.length === 3) {
    return (
      <Grid container spacing={SPACING}>
        <Grid item xs={6}>
          <AlbumImage src={albumImg[0]} />
        </Grid>
        <Grid item xs={6} container spacing={SPACING}>
          <Grid item xs={12}>
            <AlbumImage spacing={SPACING} half src={albumImg[1]} />
          </Grid>
          <Grid item xs={12}>
            <AlbumImage spacing={SPACING} half src={albumImg[2]} />
          </Grid>
        </Grid>
      </Grid>
    );
  } else if (albumImg.length === 2) {
    return (
      <Grid container spacing={SPACING}>
        <Grid item xs={6}>
          <AlbumImage spacing={SPACING} src={albumImg[0]} />
        </Grid>
        <Grid item xs={6}>
          <AlbumImage spacing={SPACING} src={albumImg[1]} />
        </Grid>
      </Grid>
    );
  } else if (albumImg.length === 1) {
    return (
      <Grid container spacing={SPACING}>
        <Grid item xs={12}>
          <AlbumImage half spacing={SPACING} src={albumImg[0]} />
        </Grid>
      </Grid>
    );
  } else {
    return <Typography variant="h4">No Image here</Typography>;
  }
};

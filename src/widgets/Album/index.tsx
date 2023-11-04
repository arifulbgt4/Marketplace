"use client";
import { FC } from "react";
import Image from "next/image";
import { Box, Grid, Button, Typography } from "@mui/material";
import WidgetsIcon from "@mui/icons-material/Widgets";

import { AlbumProps } from "./Types";

export const Album: FC<AlbumProps> = ({ albumImg }) => {
  if (albumImg.length === 1) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Image src={albumImg[0]} alt="albm" width={1496} height={728} />
        </Grid>
      </Grid>
    );
  } else if (albumImg.length === 2) {
    return (
      <Grid container spacing={3}>
        {albumImg.map((img, index) => {
          return (
            <Grid item xs={6} key={index}>
              <Image src={img} alt="albm" width={728} height={728} />
            </Grid>
          );
        })}
      </Grid>
    );
  } else if (albumImg.length === 3) {
    return (
      <Grid container spacing={3}>
        {albumImg.map((img, index) => {
          return (
            <Grid item xs={4} key={index}>
              <Image src={img} alt="albm" width={480} height={480} />
            </Grid>
          );
        })}
      </Grid>
    );
  } else if (albumImg.length === 4) {
    return (
      <Grid container spacing={3}>
        {albumImg.map((img, index) => {
          return (
            <Grid item xs={6} key={index}>
              <Image src={img} alt="albm" width={728} height={728} />
            </Grid>
          );
        })}
      </Grid>
    );
  } else if (albumImg.length === 5) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Box>
            <Image src={albumImg[0]} alt="albm" width={744} height={744} />
          </Box>
        </Grid>
        <Grid container item xs={6} spacing={3}>
          {albumImg.slice(1).map((img) => {
            return (
              <Grid item xs={6} key={img}>
                <Box>
                  <Image src={img} alt="albm" width={360} height={360} />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    );
  } else if (albumImg.length > 5) {
    {
      return (
        <>
          <Grid container spacing={3} position="relative">
            <Grid item xs={6}>
              <Image src={albumImg[0]} alt="albm" width={744} height={744} />
            </Grid>
            <Grid container item xs={6} spacing={3}>
              {albumImg.slice(1, 5).map((img) => {
                return (
                  <Grid item xs={6} key={img}>
                    <Image src={img} alt="albm" width={360} height={360} />
                  </Grid>
                );
              })}
            </Grid>
            <Box position="absolute" right={40} bottom={40}>
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
        </>
      );
    }
  } else {
    return <Typography variant="h4">No Image here</Typography>;
  }
};

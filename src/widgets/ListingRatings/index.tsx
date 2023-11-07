import { FC } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { Box, Grid, Rating, Stack, Typography } from "@mui/material";

import { ListingRatingsProps } from "./Types";

const ListingRatings: FC<ListingRatingsProps> = ({
  rating,
  avaragerating,
  review,
}) => {
  return (
    <Grid container spacing={3} pb={5}>
      <Grid item xs={12}>
        <Stack flexDirection="row" gap={1}>
          <Rating max={1} defaultValue={1} size="large" />
          <Typography variant="h4">
            {avaragerating}. {review} reviews
          </Typography>
        </Stack>
      </Grid>
      <Grid container item xs={12} columnSpacing={18} rowSpacing={3}>
        <Grid item container xs={6}>
          <Grid item xs={6}>
            <Typography>Cleanliness</Typography>
          </Grid>
          <Grid item xs={6}>
            <Stack
              flexDirection={"row"}
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <Box width="100%">
                <LinearProgress
                  variant="determinate"
                  value={rating.cleanliness}
                />
              </Box>
              <Typography>{rating.cleanliness}</Typography>
            </Stack>
          </Grid>
        </Grid>
        <Grid item container xs={6}>
          <Grid item xs={6}>
            <Typography>Communication</Typography>
          </Grid>
          <Grid item xs={6}>
            <Stack
              flexDirection="row"
              width="100%"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <Box width="100%">
                <LinearProgress
                  variant="determinate"
                  value={rating.communication}
                />
              </Box>
              <Typography>{rating.communication}</Typography>
            </Stack>
          </Grid>
        </Grid>
        <Grid item container xs={6}>
          <Grid item xs={6}>
            <Typography>Check-in</Typography>
          </Grid>
          <Grid item xs={6}>
            <Stack
              flexDirection="row"
              width="100%"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <Box width="100%">
                <LinearProgress variant="determinate" value={rating.checkIn} />
              </Box>
              <Typography>{rating.checkIn}</Typography>
            </Stack>
          </Grid>
        </Grid>
        <Grid item container xs={6}>
          <Grid item xs={6}>
            <Typography>Accuracy</Typography>
          </Grid>
          <Grid item xs={6}>
            <Stack
              flexDirection={"row"}
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <Box width="100%">
                <LinearProgress variant="determinate" value={rating.accuracy} />
              </Box>
              <Typography>{rating.accuracy}</Typography>
            </Stack>
          </Grid>
        </Grid>
        <Grid item container xs={6}>
          <Grid item xs={6}>
            <Typography>Location</Typography>
          </Grid>
          <Grid item xs={6}>
            <Stack
              flexDirection="row"
              width="100%"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <Box width="100%">
                <LinearProgress variant="determinate" value={rating.location} />
              </Box>
              <Typography>{rating.location}</Typography>
            </Stack>
          </Grid>
        </Grid>
        <Grid item container xs={6}>
          <Grid item xs={6}>
            <Typography>Value</Typography>
          </Grid>
          <Grid item xs={6}>
            <Stack
              flexDirection="row"
              width="100%"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <Box width="100%">
                <LinearProgress variant="determinate" value={rating.value} />
              </Box>
              <Typography>{rating.value}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ListingRatings;

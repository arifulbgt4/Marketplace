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
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack flexDirection="row" gap={1}>
          <Rating max={1} defaultValue={1} size="large" />
          <Typography variant="h4">
            {avaragerating}. {review} reviews
          </Typography>
        </Stack>
      </Grid>
      <Grid container item xs={12} columnSpacing={{ md: 10, lg: 30 }}>
        <Grid item xs={12} md={6}>
          <Stack
            flexDirection="row"
            gap={{ xs: 5, md: 10, lg: 30 }}
            pb={{ xs: 5, md: 0 }}
          >
            <Stack gap={5}>
              <Typography>Cleanliness</Typography>
              <Typography>Communication</Typography>
              <Typography>Check-in</Typography>
            </Stack>
            <Stack width="100%" gap={5}>
              <Stack
                flexDirection={"row"}
                width="100%"
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
                    value={rating.checkIn}
                  />
                </Box>
                <Typography>{rating.checkIn}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack flexDirection="row" gap={{ xs: 5, md: 10, lg: 30 }}>
            <Stack gap={5}>
              <Typography>Cleanliness</Typography>
              <Typography>Communication</Typography>
              <Typography>Check-in</Typography>
            </Stack>
            <Stack width="100%" gap={5}>
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
                    value={rating.accuracy}
                  />
                </Box>
                <Typography>{rating.accuracy}</Typography>
              </Stack>
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
                    value={rating.location}
                  />
                </Box>
                <Typography>{rating.location}</Typography>
              </Stack>
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
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ListingRatings;

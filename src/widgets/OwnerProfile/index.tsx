import { FC } from "react";
import {
  Avatar,
  Button,
  Divider,
  Paper,
  Link,
  useTheme,
  Stack,
  Typography,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { PieChart } from "@mui/x-charts";

import routes from "src/global/routes";

import { OwnerProfileProps } from "./Types";

const OwnerProfile: FC<OwnerProfileProps> = ({ profileData }) => {
  const {
    rating,
    totalListing,
    totalReview,
    cleanliness,
    communication,
    checkIn,
    accuracy,
    location,
    value,
  } = profileData;

  const theme = useTheme();
  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 10,
  }));

  function PieCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
  }
  return (
    <Stack component={Paper} p={{ xs: 2, md: 5 }} gap={3} elevation={0}>
      <Stack alignItems="center" gap={1} pb={{ xs: 2, md: 5 }}>
        <Avatar
          sx={{ height: 80, width: 80 }}
          src="https://scontent.fdac151-1.fna.fbcdn.net/v/t1.6435-9/57183841_350708698896126_7610830156164235264_n.jpg?stp=c0.83.500.500a_dst-jpg_s851x315&_nc_cat=103&ccb=1-7&_nc_sid=c21ed2&_nc_eui2=AeFaElRGqUVej9W3pHRzUJYzekZmaJR7xdZ6RmZolHvF1s_RFSaCIhmJ_z_gS4uUbj4a_8ibG42oZlFVJ_U8AMvQ&_nc_ohc=0syEpE5SNx0AX9PoTQp&_nc_ht=scontent.fdac151-1.fna&oh=00_AfDtqza5S0hu-bERP7JZgHE38_hoTQVmmvTq7qJ_gepnpg&oe=657190FC"
          alt="JL"
        />
        <Stack alignItems="center" gap={0.5}>
          <Typography variant="h4">Ramita MR</Typography>
          <Typography color="text.secondary">Superhost</Typography>
        </Stack>
      </Stack>
      <Stack gap={1}>
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">Total Review</Typography>
          <Typography variant="h5">{totalReview}</Typography>
        </Stack>
        <Divider />
      </Stack>
      <Stack gap={1}>
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">Total Listing</Typography>
          <Typography variant="h5">{totalListing}</Typography>
        </Stack>
        <Divider />
      </Stack>
      <Stack gap={1}>
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">Rating</Typography>
          <Typography variant="h5">{rating}</Typography>
        </Stack>
        <Divider />
      </Stack>
      <Stack gap={2}>
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="subtitle1">Cleanliness</Typography>
          </Grid>

          <Grid item xs={2}>
            <PieChart
              margin={{ right: 0 }}
              series={[
                {
                  data: [{ id: 1, value: cleanliness }],
                  endAngle: 305,
                  innerRadius: 12,
                  outerRadius: 15,
                },
              ]}
              colors={[theme.palette.primary.main]}
              height={50}
            >
              <PieCenterLabel>70%</PieCenterLabel>
            </PieChart>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={10}>
            <Typography variant="subtitle1">Communication</Typography>
          </Grid>
          <Grid item xs={2}>
            <PieChart
              margin={{ right: 0 }}
              series={[
                {
                  data: [{ id: 2, value: communication }],
                  innerRadius: 12,
                  outerRadius: 15,
                },
              ]}
              colors={[theme.palette.success.main]}
              height={50}
            >
              <PieCenterLabel>100%</PieCenterLabel>
            </PieChart>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="subtitle1">Check-in</Typography>
          </Grid>
          <Grid item xs={2}>
            <PieChart
              margin={{ right: 0 }}
              series={[
                {
                  data: [{ id: 2, value: checkIn }],
                  innerRadius: 15,
                  outerRadius: 12,
                  endAngle: 200,
                },
              ]}
              colors={[theme.palette.error.main]}
              height={50}
            >
              <PieCenterLabel>45%</PieCenterLabel>
            </PieChart>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="subtitle1">Accuracy</Typography>
          </Grid>
          <Grid item xs={2}>
            <PieChart
              colors={[theme.palette.warning.main]}
              series={[
                {
                  data: [{ id: 3, value: accuracy }],
                  innerRadius: 15,
                  outerRadius: 12,

                  endAngle: 180,
                },
              ]}
              height={50}
              margin={{ right: 0 }}
            >
              <PieCenterLabel>30%</PieCenterLabel>
            </PieChart>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="subtitle1">Location</Typography>
          </Grid>
          <Grid item xs={2}>
            <PieChart
              series={[
                {
                  data: [{ id: 4, value: location }],
                  innerRadius: 15,
                  outerRadius: 12,

                  endAngle: 195,
                },
              ]}
              margin={{ right: 0 }}
              height={50}
              colors={[theme.palette.success.main]}
            >
              <PieCenterLabel>40%</PieCenterLabel>
            </PieChart>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="subtitle1">Value</Typography>
          </Grid>
          <Grid item xs={2}>
            <PieChart
              series={[
                {
                  data: [{ id: 1, value: value }],
                  innerRadius: 15,
                  outerRadius: 12,

                  endAngle: 330,
                },
              ]}
              colors={[theme.palette.primary.light]}
              margin={{ right: 0 }}
              height={50}
            >
              <PieCenterLabel>90%</PieCenterLabel>
            </PieChart>
          </Grid>
        </Grid>
      </Stack>
      <Button
        fullWidth
        variant="outlined"
        component={Link}
        href={routes.userSetting}
      >
        Edit Profile
      </Button>
    </Stack>
  );
};

export default OwnerProfile;

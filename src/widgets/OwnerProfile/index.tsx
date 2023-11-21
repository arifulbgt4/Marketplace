import { FC } from "react";
import {
  Avatar,
  Button,
  Divider,
  Paper,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

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

  return (
    <Stack component={Paper} p={5} gap={3} elevation={0}>
      <Stack alignItems="center" gap={1} pb={5}>
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
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1">Cleanliness</Typography>
          <Rating defaultValue={cleanliness} />
        </Stack>
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1">Communication</Typography>
          <Rating defaultValue={communication} />
        </Stack>
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1">Check-in</Typography>
          <Rating defaultValue={checkIn} />
        </Stack>
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1">Accuracy</Typography>
          <Rating defaultValue={accuracy} />
        </Stack>
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1">Location</Typography>
          <Rating defaultValue={location} />
        </Stack>
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1">Value</Typography>
          <Rating defaultValue={value} />
        </Stack>
      </Stack>
      <Button fullWidth variant="outlined">
        Edit Profile
      </Button>
    </Stack>
  );
};

export default OwnerProfile;

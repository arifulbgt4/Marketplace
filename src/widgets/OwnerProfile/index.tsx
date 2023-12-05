import { FC } from "react";
import {
  Avatar,
  Button,
  Divider,
  Paper,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

import routes from "src/global/routes";
import Parcent from "src/components/Parsent";

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
    src,
    name,
  } = profileData;

  return (
    <Stack component={Paper} p={{ xs: 2, md: 5 }} gap={3} elevation={0}>
      <Stack alignItems="center" gap={1} pb={{ xs: 2, md: 5 }}>
        {src ? (
          <Avatar sx={{ height: 80, width: 80 }} src={src} alt="JL" />
        ) : (
          <AccountCircleRoundedIcon
            sx={{ height: 80, width: 80 }}
            color="disabled"
            fontSize="large"
          />
        )}

        <Stack alignItems="center" gap={0.5}>
          <Typography variant="h4">{name}</Typography>
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
        <Parcent title="Cleanliness" value={cleanliness} />
        <Parcent title="Communication" value={communication} />
        <Parcent title="Check in" value={checkIn} />
        <Parcent title="Accuracy" value={accuracy} />
        <Parcent title="Location" value={location} />
        <Parcent title="Value" value={value} />
      </Stack>
      <Button
        fullWidth
        variant="outlined"
        component={Link}
        href={routes.userSetting}
        startIcon={<EditIcon />}
      >
        Edit Profile
      </Button>
    </Stack>
  );
};

export default OwnerProfile;

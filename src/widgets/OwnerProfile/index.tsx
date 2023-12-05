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
  } = profileData;

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

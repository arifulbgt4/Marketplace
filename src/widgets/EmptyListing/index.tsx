import { FC } from "react";
import { EmptyListingProps } from "./Types";
import { Link, Stack, Typography } from "@mui/material";

const EmptyListing: FC<EmptyListingProps> = () => {
  return (
    <Stack gap={5}>
      <Typography variant="h4">My Listings</Typography>
      <Stack gap={2.5}>
        <Typography variant="h5">You Have Made No Listing yet!</Typography>
        <Stack
          gap={0.75}
          flexDirection="row"
          alignItems="center"
          alignSelf="stretch"
        >
          <Typography variant="subtitle1">
            Listings you have Properties on show up here. Lets make a new
            listing
          </Typography>
          <Link href="#">Click Here</Link>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default EmptyListing;

import { FC } from "react";
import { Rating, Stack, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

import { ListingHeaderProps } from "./Types";

const ListingHeader: FC<ListingHeaderProps> = ({ listingheader }) => {
  const { title, rating, review, creator, address } = listingheader;
  return (
    <Stack gap={1}>
      <Typography variant="h4">{title}</Typography>
      <Stack flexDirection="row" alignItems="center" gap={1}>
        <Stack gap={1} flexDirection="row" alignItems="center">
          <Rating max={1} defaultValue={1} size="large" />
          <Typography>{rating}</Typography>
        </Stack>
        <Typography>{"."}</Typography>
        <Typography>{review} reviews</Typography>
        <Typography>{"."}</Typography>
        <Stack gap={1} flexDirection="row" alignItems="center">
          <PersonIcon color="action" />

          <Typography>{creator}</Typography>
        </Stack>
        <Typography>{"."}</Typography>
        <Typography>{address}</Typography>
      </Stack>
    </Stack>
  );
};

export default ListingHeader;

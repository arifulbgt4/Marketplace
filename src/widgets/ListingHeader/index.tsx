import { FC } from "react";
import { Hidden, Rating, Stack, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

import { ListingHeaderProps } from "./Types";

const ListingHeader: FC<ListingHeaderProps> = ({
  title,
  rating,
  review,
  creator,
  address,
}) => {
  return (
    <Stack gap={1}>
      <Typography variant="h4">{title}</Typography>
      <Stack flexDirection="row" alignItems="center" gap={1}>
        {rating && (
          <>
            {" "}
            <Stack gap={1} flexDirection="row" alignItems="center">
              <Rating max={1} defaultValue={1} size="large" readOnly />
              <Typography>{rating}</Typography>
            </Stack>
            <Typography>{"."}</Typography>
          </>
        )}
        {review && (
          <>
            <Typography>{review} reviews</Typography>
            <Typography>{"."}</Typography>
          </>
        )}
        <Hidden mdDown>
          <Stack gap={1} flexDirection="row" alignItems="center">
            <PersonIcon />
            <Typography>{creator}</Typography>
          </Stack>
          <Typography>{"."}</Typography>
          <Typography>{address}</Typography>
        </Hidden>
      </Stack>
    </Stack>
  );
};

export default ListingHeader;

"use client";
import { FC, useState } from "react";
import {
  Hidden,
  Rating,
  Stack,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

import { ListingHeaderProps } from "./Types";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import ShareIcon from "@mui/icons-material/Share";
import { Divider } from "@mui/material";

const ListingHeader: FC<ListingHeaderProps> = ({
  title,
  rating,
  review,
  creator,
  address,
}) => {
  const [isSelect, setIsSelect] = useState(false);
  return (
    <Stack gap={1}>
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography variant="h4">{title}</Typography>
        </Box>
        <Box
          borderRadius={5}
          border={1}
          borderColor={(theme) => theme.palette.action.active}
          display="flex"
          flexDirection="row"
        >
          <Button
            onClick={() => {
              setIsSelect((prv) => !prv);
            }}
            size="large"
          >
            {isSelect ? (
              <BookmarkIcon color="primary" />
            ) : (
              <BookmarkBorderOutlinedIcon color="primary" />
            )}
          </Button>
          <Divider
            orientation="vertical"
            sx={{ color: (theme) => theme.palette.divider }}
          />
          <Button>
            <ShareIcon />
          </Button>
        </Box>
      </Stack>
      <Stack flexDirection="row" alignItems="center" gap={1}>
        {rating && (
          <>
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

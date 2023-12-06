"use client";
import { FC, useState } from "react";
import {
  Hidden,
  Rating,
  Stack,
  Typography,
  Button,
  Box,
  ButtonGroup,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import ShareIcon from "@mui/icons-material/Share";

import { ListingHeaderProps } from "./Types";

const ListingHeader: FC<ListingHeaderProps> = ({
  title,
  rating,
  review,
  creator,
  address,
}) => {
  const [isSelect, setIsSelect] = useState(false);
  return (
    <Stack
      direction={{ md: "row", sx: "column" }}
      justifyContent="space-between"
      rowGap={3}
      px={1}
    >
      <Stack gap={1}>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography variant="h4">{title}</Typography>
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
      <Box>
        <ButtonGroup
          sx={{
            border: 1,
            borderColor: (theme) => theme.palette.action.active,
            borderRadius: 5,
          }}
        >
          <Button
            onClick={() => {
              setIsSelect((prv) => !prv);
            }}
            variant="text"
            sx={{
              borderRight: 1,
              borderColor: (theme) => theme.palette.divider,
              px: 2,
            }}
          >
            {isSelect ? (
              <BookmarkIcon color="primary" />
            ) : (
              <BookmarkBorderOutlinedIcon color="action" />
            )}
          </Button>

          <Button
            variant="text"
            sx={{
              borderLeft: 1,
              borderColor: (theme) => theme.palette.divider,
              px: 2,
            }}
          >
            <ShareIcon color="action" />
          </Button>
        </ButtonGroup>
      </Box>
    </Stack>
  );
};

export default ListingHeader;

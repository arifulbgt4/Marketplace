import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { EmptyBookmarkProps } from "./Types";

const EmptyBookmark: FC<EmptyBookmarkProps> = () => {
  return (
    <Stack gap={5}>
      <Typography variant="h4">My Bookmarks</Typography>
      <Stack gap={2.5}>
        <Typography variant="h5">You Have No Property on Bookmark!</Typography>
        <Typography variant="subtitle1">
          You have no Properties on show up here.
        </Typography>
      </Stack>
    </Stack>
  );
};

export default EmptyBookmark;

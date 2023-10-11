"use client";
import { FC } from "react";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import SkipPreviousOutlinedIcon from "@mui/icons-material/SkipPreviousOutlined";
import SkipNextOutlinedIcon from "@mui/icons-material/SkipNextOutlined";

import { ListingPaginationProps } from "./Types";

const ListingPagination: FC<ListingPaginationProps> = () => {
  return (
    <Box>
      <Pagination
        count={7}
        renderItem={(item) => (
          <PaginationItem
            slots={{
              previous: SkipPreviousOutlinedIcon,
              next: SkipNextOutlinedIcon,
            }}
            {...item}
          />
        )}
      />
    </Box>
  );
};

export default ListingPagination;

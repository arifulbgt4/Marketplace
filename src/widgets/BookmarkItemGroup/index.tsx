"use client";
import { FC } from "react";
import { Grid } from "@mui/material";

import Listing from "src/widgets/Listing";
import { searchListingData } from "src/global/staticData/index";

import { BookmarkItemGroupProps } from "./Types";

const BookmarkItemGroup: FC<BookmarkItemGroupProps> = () => {
  return (
    <Grid container spacing={3}>
      {searchListingData.map((data) => {
        const { id, image, title, slug, address } = data;
        return (
          <Grid item md={4} sm={6} xs={12} key={id}>
            <Listing
              isMark={true}
              key={id}
              id={id}
              slug={slug}
              image={image}
              title={title}
              address={address}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default BookmarkItemGroup;

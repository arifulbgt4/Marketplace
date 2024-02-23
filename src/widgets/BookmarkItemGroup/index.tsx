"use client";
import { FC } from "react";
import { Grid } from "@mui/material";

import Listing from "src/widgets/Listing";
import { searchListingData } from "src/global/staticData/index";

import { BookmarkItemGroupProps } from "./Types";

const BookmarkItemGroup: FC<BookmarkItemGroupProps> = () => {
  return (
    <Grid container spacing={5} justifyContent="center">
      {searchListingData.map((data) => {
        const { id, image, title, slug, address } = data;
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} xxl={2} key={id}>
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

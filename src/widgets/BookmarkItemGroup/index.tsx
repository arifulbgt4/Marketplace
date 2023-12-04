"use client";
import { FC } from "react";
import { Grid, Typography } from "@mui/material";
import Listing from "src/widgets/Listing";
import { searchListingData } from "src/global/staticData/index";

import { BookmarkItemGroupProps } from "./Types";

const BookmarkItemGroup: FC<BookmarkItemGroupProps> = () => {
  return (
    <Grid container gap={5}>
      <Grid item xs={12}>
        <Typography variant="h3" color={(theme) => theme.palette.text.primary}>
          Bookmars
        </Typography>
      </Grid>
      <Grid item xs={12} container spacing={5}>
        {searchListingData.map((data) => {
          const {
            id,
            image,
            title,
            price,
            description,
            services,
            rating,
            slug,
            address,
          } = data;
          return (
            <Grid item md={4} sm={6} xs={12}>
              <Listing
                id={id}
                slug={slug}
                image={image}
                title={title}
                price={price}
                services={services}
                description={description}
                rating={rating}
                address={address}
              />
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default BookmarkItemGroup;

import { FC } from "react";
import { Grid } from "@mui/material";

import { listingReviewerData } from "src/global/staticData";
import Review from "../Review";

import { ListingReviewsProps } from "./Types";

const ListingReviews: FC<ListingReviewsProps> = () => {
  return (
    <Grid container spacing={3}>
      {listingReviewerData.map((data) => {
        const { id, title, subheader, description, img } = data;
        return (
          <Grid key={id} item xs={12} md={4}>
            <Review
              id={id}
              title={title}
              subheader={subheader}
              description={description}
              img={img}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ListingReviews;

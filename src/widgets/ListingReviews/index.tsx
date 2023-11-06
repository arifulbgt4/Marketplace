import { FC } from "react";
import { Grid } from "@mui/material";

import { reviewerData } from "src/global/staticData";
import Review from "../Review";

import { ListingReviewsProps } from "./Types";

const ListingReviews: FC<ListingReviewsProps> = () => {
  return (
    <Grid container spacing={4.5}>
      {reviewerData.map((data) => {
        const { id, title, subheader, description, img } = data;
        return (
          <Grid key={id} item xs={4}>
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

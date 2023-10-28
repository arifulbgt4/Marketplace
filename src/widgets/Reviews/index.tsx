import { FC } from "react";
import { Grid } from "@mui/material";

import { reviewerData } from "src/global/staticData";
import Review from "../Review";

import { ReviewsProps } from "./Types";

const Reviews: FC<ReviewsProps> = () => {
  return (
    <Grid container spacing={3}>
      {reviewerData.map((data) => {
        const { id, title, subheader, description, img } = data;
        return (
          <Grid key={id} item xs={4} spacing={3}>
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

export default Reviews;

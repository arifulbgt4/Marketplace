import { FC } from "react";
import { Grid } from "@mui/material";

import Review from "../Review";

import { ReviewsProps } from "./Types";
import { reviewerData } from "src/global/staticData";

const Reviews: FC<ReviewsProps> = () => {
  return (
    <Grid container spacing={3}>
      {reviewerData.map((data) => {
        const { id, title, subheader, description, img, action } = data;
        return (
          <Grid key={id} item xs={4} spacing={3}>
            <Review
              id={id}
              title={title}
              subheader={subheader}
              description={description}
              img={img}
              action={action}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Reviews;

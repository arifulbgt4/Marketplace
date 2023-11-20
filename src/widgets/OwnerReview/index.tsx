import { FC } from "react";
import { Grid, Button, Typography, Divider } from "@mui/material";

import { userReviewData } from "src/global/staticData";
import Review from "../Review";
import { OwnerReviewProps } from "./Types";

const OwnerReview: FC<OwnerReviewProps> = () => {
  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12} display="flex" gap={1}>
        <Typography variant="h5">reviews</Typography>
        <Divider />
      </Grid>
      <Grid item container xs={12} spacing={3}>
        {userReviewData.map((data) => {
          const { id, title, subheader, description, img } = data;
          return (
            <Grid key={id} item xs={12} md={6}>
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
    </Grid>
  );
};

export default OwnerReview;

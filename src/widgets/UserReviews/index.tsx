import { FC } from "react";
import { Grid, Button, Typography, Divider } from "@mui/material";

import { userReviewData } from "src/global/staticData";
import Review from "../Review";

import { UserReviewsProps } from "./Types";

const UserReviews: FC<UserReviewsProps> = () => {
  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12} display="flex" gap={1}>
        <Typography variant="h5">Listings</Typography>
        <Divider />
      </Grid>
      <Grid item container xs={12} spacing={3}>
        {userReviewData.map((data) => {
          const { id, title, subheader, description, img } = data;
          return (
            <Grid key={id} item xs={12}>
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
        <Grid item xs={12}>
          <Button variant="outlined" color="inherit" size="large">
            Show all 24 reviews
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserReviews;

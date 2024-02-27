import { FC } from "react";
import { Grid, Typography, Divider } from "@mui/material";

import { userReviewData } from "src/global/staticData";
import Review from "../Review";

import { UserReviewsProps } from "./Types";

const UserReviews: FC<UserReviewsProps> = () => {
  return (
    <Grid container rowSpacing={5}>
      <Grid
        item
        xs={12}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography
          textAlign="center"
          variant="h2"
          fontFamily="__DM_Sans_048603"
          fontWeight={700}
        >
          What our customer say
        </Typography>
        <Typography textAlign="center" variant="h6" color="text.secondary">
          Check honest reviews from our customer
        </Typography>
        <Divider />
      </Grid>
      <Grid item container xs={12} spacing={5}>
        {userReviewData.map((data) => {
          const { id, title, subheader, description, img } = data;
          return (
            <Grid key={id} xs={12} item md={4}>
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

export default UserReviews;

import { FC } from "react";
import { useTranslations } from "next-intl";
import { Box, Container, Grid, Typography } from "@mui/material";

import Listing from "src/widgets/Listing";
import { recentPostData } from "src/global/staticData";

import { RecentListingsProps } from "./Types";

const RecentListings: FC<RecentListingsProps> = () => {
  const t = useTranslations();
  return (
    <Box>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h3">Recent Properties</Typography>
          </Grid>

          <Grid item container xs={12} spacing={4}>
            {recentPostData.map((data) => {
              const {
                id,
                image,
                title,

                description,
                rating,
                slug,
                address,
              } = data;
              return (
                <Grid item xs={12} md={4} key={id}>
                  <Listing
                    id={id}
                    slug={slug}
                    image={image}
                    title={title}
                    address={address}
                    rating={rating}
                    description={description}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RecentListings;

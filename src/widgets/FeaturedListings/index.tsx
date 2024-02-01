import { FC } from "react";
import { useTranslations } from "next-intl";
import { Grid, Typography, Box, Container } from "@mui/material";

import Listing from "src/widgets/Listing";
import { featurePostData } from "src/global/staticData";

import { FeaturedListingsProps } from "./Types";

const FeaturedListings: FC<FeaturedListingsProps> = () => {
  const t = useTranslations();
  return (
    <Box>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h3">Featured Properties</Typography>
          </Grid>

          <Grid item xs={12} spacing={4} container>
            {featurePostData.map((data) => {
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
                    address={address}
                    slug={slug}
                    image={image}
                    title={title}
                    description={description}
                    rating={rating}
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

export default FeaturedListings;

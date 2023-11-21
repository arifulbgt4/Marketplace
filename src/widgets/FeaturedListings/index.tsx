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
        <Grid
          container
          spacing={{ xs: 2, md: 3, lg: 6 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={12}>
            <Typography variant="h3">
              {t("sectionTitle.featuredProperties")}
            </Typography>
          </Grid>

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
              <Grid item xs={4} key={id}>
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
      </Container>
    </Box>
  );
};

export default FeaturedListings;

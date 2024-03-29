import { FC } from "react";
import { useTranslations } from "next-intl";
import { Grid, Container } from "@mui/material";

import Listing from "src/widgets/Listing";
import { featurePostData } from "src/global/staticData";

import { FeaturedListingsProps } from "./Types";

const FeaturedListings: FC<FeaturedListingsProps> = () => {
  const t = useTranslations();
  return (
    <Container>
      <Grid spacing={5} container justifyContent="center">
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
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} xxl={2} key={id}>
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
  );
};

export default FeaturedListings;

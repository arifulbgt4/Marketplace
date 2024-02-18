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
      <Grid spacing={8} container>
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
            <Grid
              item
              xs={12}
              md={3}
              key={id}
              sx={{
                flex: 1,
                display: "flex",
              }}
            >
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

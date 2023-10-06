import { FC } from "react";
import { useTranslations } from "next-intl";
import { Grid, Typography, Box } from "@mui/material";

import Listing from "src/widgets/Listing";

import { FeaturedListingsProps } from "./Types";
import { ListingData } from "../ListingData/ListingData";

const FeaturedListings: FC<FeaturedListingsProps> = () => {
  const t = useTranslations();
  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      <Grid item xs={12}>
        <Typography variant="h3">
          {t("sectionTitle.featuredProperties")}
        </Typography>
      </Grid>

      {ListingData.map((data) => {
        const { id, image, title, price, description, rating, slug } = data;
        return (
          <Grid item xs={4} key={id}>
            <Listing
              id={id}
              slug={slug}
              image={image}
              title={title}
              price={price}
              description={description}
              rating={rating}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default FeaturedListings;

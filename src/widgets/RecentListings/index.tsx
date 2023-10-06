import { FC } from "react";
import { useTranslations } from "next-intl";
import { Grid, Typography } from "@mui/material";

import Listing from "src/widgets/Listing";

import { RecentListingsProps } from "./Types";
import { ListingData } from "../ListingData/ListingData";

const RecentListings: FC<RecentListingsProps> = () => {
  const t = useTranslations();
  return (
    <Grid container spacing={5} pt={1}>
      <Grid item xs={12}>
        <Typography variant="h3">
          {t("sectionTitle.recentProperties")}
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

export default RecentListings;

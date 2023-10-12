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
        <Grid
          container
          spacing={{ xs: 2, md: 3, lg: 6 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={12}>
            <Typography variant="h3">
              {t("sectionTitle.recentProperties")}
            </Typography>
          </Grid>

          {recentPostData.map((data) => {
            const {
              id,
              image,
              title,
              price,
              description,
              rating,
              slug,
              address,
            } = data;
            return (
              <Grid item xs={4} key={id}>
                <Listing
                  id={id}
                  slug={slug}
                  image={image}
                  title={title}
                  price={price}
                  address={address}
                  rating={rating}
                  description={description}
                />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default RecentListings;

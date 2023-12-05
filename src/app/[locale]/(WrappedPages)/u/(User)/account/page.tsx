"use client";
import { Grid } from "@mui/material";

import OwnerAbout from "src/widgets/OwnerAbout";
import OwnerBasicInfo from "src/widgets/OwnerBasicInfo";
import OwnerProfile from "src/widgets/OwnerProfile";
import OwnerReview from "src/widgets/OwnerReview";

const profileData = {
  rating: 4.5,
  totalListing: 8,
  totalReview: 20,
  cleanliness: 80,
  communication: 60,
  checkIn: 10,
  accuracy: 100,
  location: 30,
  value: 50,
};

export default function Account() {
  return (
    <Grid container columnSpacing={10} rowSpacing={3}>
      <Grid item md={4} xs={12}>
        <OwnerProfile profileData={profileData} />
      </Grid>
      <Grid item container xs={12} md={8} rowSpacing={5}>
        <Grid item xs={12}>
          <OwnerAbout />
        </Grid>
        <Grid item xs={12}>
          <OwnerBasicInfo />
        </Grid>
        <Grid item xs={12}>
          <OwnerReview />
        </Grid>
      </Grid>
    </Grid>
  );
}
